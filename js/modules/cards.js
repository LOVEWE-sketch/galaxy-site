// Club Management & Card Animation Module
export const CardManager = {
  // Club data management
  clubs: new Set(),
  
  // Add clubs from elements with data-club attribute
  collectClubs(selector = '[data-club]') {
    document.querySelectorAll(selector).forEach(el => {
      const club = (el.dataset.club || '').trim();
      if (club && club !== 'Unknown') this.clubs.add(club);
    });
    return Array.from(this.clubs).sort();
  },

  // Populate any select with collected clubs
  populateClubSelect(selectId = 'club-filter') {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Keep existing first option (usually "All Clubs")
    const firstOption = select.firstElementChild;
    select.innerHTML = '';
    if (firstOption) select.appendChild(firstOption);
    
    // Add sorted club options
    this.collectClubs().forEach(club => {
      const opt = document.createElement('option');
      opt.value = club;
      opt.textContent = club;
      select.appendChild(opt);
    });
  },

  // Animation Management with IntersectionObserver
  initAnimations(selector = '.person-card, .story-card', options = {}) {
    const {
      threshold = 0.2,
      rootMargin = '50px',
      animClassPrefix = 'anim-',
      variations = 6,
      baseDelay = 0.1
    } = options;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Remove any existing animation classes
          const existing = Array.from(el.classList)
            .find(c => c.startsWith(animClassPrefix));
          if (existing) el.classList.remove(existing);
          
          // Add new animation class with delay
          const animClass = \`\${animClassPrefix}\${(idx % variations) + 1}\`;
          el.style.animationDelay = \`\${(idx % variations) * baseDelay}s\`;
          el.classList.add(animClass, 'will-animate');
          
          // Stop observing after animation
          observer.unobserve(el);
        }
      });
    }, { threshold, rootMargin });

    document.querySelectorAll(selector).forEach(el => {
      // Reset element state
      el.classList.add('pre-animation');
      observer.observe(el);
    });
  }
};

// Role/Filter Management
export const FilterManager = {
  init(options = {}) {
    const {
      roleButtonsSelector = '.role-filters button',
      peopleGridId = 'peopleGrid',
      filterSelectors = {
        position: '#position-filter',
        age: '#age-filter',
        club: '#club-filter'
      }
    } = options;

    this.roleButtons = document.querySelectorAll(roleButtonsSelector);
    this.peopleGrid = document.getElementById(peopleGridId);
    this.personCards = this.peopleGrid ? 
      Array.from(this.peopleGrid.querySelectorAll('.person-card')) : [];
    
    // Wire up role filters
    this.roleButtons.forEach(btn => 
      btn.addEventListener('click', () => this.setActiveRole(btn.dataset.role)));
    
    // Wire up dropdowns
    Object.entries(filterSelectors).forEach(([key, selector]) => {
      const el = document.querySelector(selector);
      if (el) el.addEventListener('change', () => this.applyFilters());
    });

    // Initial state
    this.setActiveRole('all');
    this.applyFilters();
  },

  setActiveRole(role) {
    this.roleButtons.forEach(b => 
      b.classList.toggle('active', b.dataset.role === role));
    this.applyFilters();
  },

  applyFilters() {
    const activeRole = document.querySelector('.role-filters button.active')?.dataset.role;
    const pos = document.querySelector('#position-filter')?.value || '';
    const age = document.querySelector('#age-filter')?.value || '';
    const club = document.querySelector('#club-filter')?.value || '';

    this.personCards.forEach(card => {
      let show = true;
      
      // Role filter
      if (activeRole !== 'all' && card.dataset.role !== activeRole) show = false;
      
      // Position filter
      if (show && pos && card.dataset.position !== pos) show = false;
      
      // Age filter
      if (show && age) {
        const cardAge = Number(card.dataset.age) || 0;
        if (age === 'U18' && cardAge >= 18) show = false;
        if (age === '18-23' && (cardAge < 18 || cardAge > 23)) show = false;
        if (age === '24+' && cardAge < 24) show = false;
      }
      
      // Club filter
      if (show && club && card.dataset.club !== club) show = false;
      
      // Apply visibility
      card.style.display = show ? '' : 'none';
      
      // Trigger animation if becoming visible
      if (show && !card.classList.contains('animated')) {
        CardManager.initAnimations(\`#\${card.id}\`);
      }
    });
  }
};
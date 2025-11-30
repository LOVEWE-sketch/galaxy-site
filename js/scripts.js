import { AnimationManager } from './modules/animations.js';

// Initialize animation manager
const animManager = new AnimationManager({
    threshold: 0.2,
    rootMargin: '50px'
});

// Helper function to distribute animations
function distributeAnimations(elements, startIndex = 1) {
    elements.forEach((element, index) => {
        const animationClass = `anim-${((index + startIndex - 1) % 6) + 1}`;
        animManager.setAnimation(element, animationClass);
        element.setAttribute('data-repeat-animation', 'true');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('yr').textContent = new Date().getFullYear();

    // Load content from projects.json
    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
            // Populate Teams section
            const teamsContainer = document.querySelector('#teams .grid-3');
            if(teamsContainer && data.teams && data.teams.length){
                data.teams.forEach(team => {
                    const teamCard = document.createElement('div');
                    teamCard.className = 'team-card';
                    teamCard.innerHTML = `
                        <img src="${team.logo || ''}" alt="${team.name} logo">
                        <h4>${team.name}</h4>
                        <p>${team.description}</p>
                    `;
                    teamsContainer.appendChild(teamCard);
                });
            }

            // Populate Players section
            const playersContainer = document.querySelector('#players .players');
            if(playersContainer && data.players && data.players.length){
                data.players.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.className = 'player-card card';
                // Use a safe src fallback and handle broken/missing images with onerror
                const safePlayerSrc = (player.photo && player.photo.toString().trim())
                    ? (player.photo.startsWith('http') || player.photo.startsWith('assets/') ? player.photo : `assets/images/${player.photo}`)
                    : 'https://via.placeholder.com/320x180?text=No+photo';
                                // If the player has an external wiki or link, open that in a new tab;
                                // otherwise use the internal player profile page.
                                const profileHref = player.wiki ? player.wiki : `player-${player.id}.html`;
                                const isExternal = !!player.wiki;
                                playerCard.innerHTML = `
                                        <a href="${profileHref}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} style="color:inherit;text-decoration:none;display:block">
                                            <img src="${safePlayerSrc}" alt="${player.name}" onerror="this.onerror=null;this.src='assets/images/default-player.svg'">
                                            <h4>${player.name}</h4>
                                        </a>
                    <div class="player-meta">
                        <div>
                            <small>Position: ${player.position}</small><br>
                            <small>Age: ${player.age}</small>
                        </div>
                        <div>
                            <strong>Profile</strong>
                        </div>
                    </div>
                `;
                    playersContainer.appendChild(playerCard);
                });
            }

            // ALSO populate players listing page (#peopleGrid) if present
            const peopleGrid = document.querySelector('#peopleGrid');
            if(peopleGrid){
                // clear any existing content (placeholder)
                peopleGrid.innerHTML = '';
                data.players.forEach(player => {
                    const article = document.createElement('article');
                    article.className = 'person-card';
                    article.setAttribute('data-role', 'player');
                    article.setAttribute('data-position', player.position || '');
                    article.setAttribute('data-age', String(player.age || ''));
                    article.setAttribute('data-club', player.currentClub || '');
                    // If player.photo is empty use a visible placeholder so the grid remains consistent
                    const personPhotoSrc = (player.photo && player.photo.toString().trim()) ? (player.photo.startsWith('http') || player.photo.startsWith('assets/') ? player.photo : `assets/images/${player.photo}`) : 'https://via.placeholder.com/240x180?text=No+photo';
                    const playerHref = player.wiki ? player.wiki : `player-${player.id}.html`;
                    const external = !!player.wiki;
                    article.innerHTML = `
                        <a href="${playerHref}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''} style="color:inherit;text-decoration:none;display:flex;gap:12px;align-items:center">
                          <div class="person-photo" style="background-image:url('${personPhotoSrc}')" aria-hidden="true"></div>
                          <div class="person-body">
                              <h4 class="person-name">${player.name}</h4>
                              <div class="person-meta">${player.position || ''} • Age ${player.age || ''} • ${player.currentClub || ''}</div>
                          </div>
                        </a>
                    `;
                    peopleGrid.appendChild(article);
                });
                // let page-level scripts know the players were inserted
                document.dispatchEvent(new CustomEvent('playersPopulated'));
            }

            // Populate News section
            const newsContainer = document.querySelector('#news .news-list');
            const isNewsPage = document.body.classList.contains('page-news') || (window.location.pathname || '').endsWith('news.html');
            if(newsContainer && data.news && data.news.length){
                // limit displayed items on news page to 10, otherwise show all on home
                const newsToShow = isNewsPage ? data.news.slice(0, 10) : data.news;
                newsToShow.forEach(item => {
                const newsCard = document.createElement('div');
                newsCard.className = 'card';
                // include image if available; add safe fallback via onerror to a placeholder
                let imageSrc = 'https://via.placeholder.com/800x200?text=No+image';
                if(item.image){
                    // accept full paths (assets/ or http) or bare filenames
                    if(item.image.startsWith('http') || item.image.startsWith('assets/')){
                        imageSrc = item.image;
                    } else {
                        imageSrc = `assets/images/${item.image}`;
                    }
                }
                    // On the full news page we show the article (no 'Read more' link). On the homepage keep the small read link that links to the full article.
                    const articleLink = `news-item-${item.id}.html`;
                    const readAnchor = isNewsPage ? '' : ` <a href="${articleLink}">Read more</a>`;
                    // Format date nicely
                    const dateObj = new Date(item.date);
                    const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                                        newsCard.innerHTML = `
                                        <div class="news-media"><img class="news-thumb" src="${imageSrc}" alt="${item.title}" onerror="this.onerror=null;this.src='assets/images/default-player.svg'"></div>
                                        <div class="news-card-body">
                                            <div class="news-card-meta"><div style="font-size:12px;color:var(--accent);font-weight:600">${dateStr}</div></div>
                                            <h4 class="news-card-title"><a href="${articleLink}" style="color:inherit;text-decoration:none">${item.title}</a></h4>
                                            <p class="news-card-excerpt">${item.excerpt}${readAnchor}</p>
                                        </div>
                                `;
                    newsContainer.appendChild(newsCard);
                });
            }

            // On the news page add a player-stories grid showing up to 10 player boxes (real players then placeholders)
            const storiesGrid = document.querySelector('#player-stories .players-grid');
            if(isNewsPage && storiesGrid){
                // ensure clear
                storiesGrid.innerHTML = '';
                const players = Array.isArray(data.players) ? data.players.slice(0, 10) : [];
                // create cards for players
                                players.forEach((p, idx) => {
                                        const card = document.createElement('div');
                                        card.className = 'player-card card';
                                        const profileLink = `player-${p.id}.html`;
                                        card.innerHTML = `
                                                <a href="${profileLink}" style="color:inherit;text-decoration:none;display:block">
                                                    <img src="${p.photo || 'https://via.placeholder.com/320x180?text=No+photo'}" alt="${p.name}" style="width:100%; height:160px; object-fit:cover; border-radius:8px; margin-bottom:10px;" onerror="this.onerror=null;this.src='https://via.placeholder.com/320x180?text=Image+missing'">
                                                    <h4>${p.name}</h4>
                                                </a>
                                                <div style="padding:0 6px 8px;">
                                                    <div style="font-size:14px;color:var(--muted);margin-bottom:6px">${p.position || ''} • Age ${p.age || ''} • ${p.currentClub || ''}</div>
                                                    <p style="color:var(--muted);margin:0">${p.highlights || ''}</p>
                                                </div>
                                        `;
                    storiesGrid.appendChild(card);
                });

                // if less than 10 players, add placeholders to make up to 10 boxes
                const current = players.length;
                for(let i = current; i < 10; i++){
                    const ph = document.createElement('div');
                    ph.className = 'player-card card placeholder';
                    ph.innerHTML = `
                        <div style="width:100%; height:160px; display:flex;align-items:center;justify-content:center;background:linear-gradient(90deg,#f0f2f6,#fafbfd);border-radius:8px;margin-bottom:10px;color:var(--muted);">More stories coming</div>
                        <h4>More Coming Soon</h4>
                        <p style="color:var(--muted)">We are adding more player stories—check back soon.</p>
                    `;
                    storiesGrid.appendChild(ph);
                }
            }
        })
        .catch(error => console.error('Error loading data:', error));

    // Handle contact form submission
    window.handleContact = function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('c_name').value,
            email: document.getElementById('c_email').value,
            subject: document.getElementById('c_subject').value,
            message: document.getElementById('c_message').value
        };
        // If a public form endpoint is configured (e.g. Microsoft Forms / Google Forms), open it in a new tab and pass a simple querystring.
        // Configure this in your site by setting a global `window.contactRedirectUrl` to the target form URL.
        if(window.contactRedirectUrl && typeof window.contactRedirectUrl === 'string' && window.contactRedirectUrl.length){
            try{
                const qs = new URLSearchParams(data).toString();
                window.open(window.contactRedirectUrl + (window.contactRedirectUrl.includes('?') ? '&' : '?') + qs, '_blank');
                alert('Opening external contact form to submit your message.');
                e.target.reset();
                return;
            }catch(err){
                console.warn('Failed to redirect contact form:', err);
            }
        }
        console.log('Contact form submitted', data);
        alert('Thanks — your message has been recorded (demo).');
        e.target.reset();
    };

    // Smooth scrolling for navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const id = anchor.getAttribute('href').slice(1);
            document.getElementById(id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Initialize animations
    // Animate header elements
    const headerElements = document.querySelectorAll('header *');
    distributeAnimations(headerElements);
    animManager.observe(headerElements);

    // Animate cards with stagger effect
    const cards = document.querySelectorAll('.card');
    distributeAnimations(cards, 2);
    animManager.observe(cards);

    // Animate team cards
    const teamCards = document.querySelectorAll('.team-card');
    distributeAnimations(teamCards, 3);
    animManager.observe(teamCards);

    // Animate sections
    document.querySelectorAll('section').forEach((section, index) => {
        const elements = section.querySelectorAll(':scope > *:not(.card):not(.team-card)');
        distributeAnimations(elements, index + 1);
        animManager.observe(elements);
    });

    // Player image lightbox: if any image has .player-image, connect a simple lightbox
    (function initPlayerLightbox(){
        const imgs = document.querySelectorAll('img.player-image');
        if(!imgs || !imgs.length) return;

        // create lightbox markup
        let lb = document.querySelector('.lightbox');
        if(!lb){
            lb = document.createElement('div'); lb.className = 'lightbox';
            lb.innerHTML = '<button class="lb-close" aria-label="Close">×</button><img alt="Player image (full)">';
            document.body.appendChild(lb);
        }
        const lbImage = lb.querySelector('img');
        const closeBtn = lb.querySelector('.lb-close');

        function open(src){ lbImage.src = src; lb.classList.add('open'); document.body.style.overflow='hidden'; }
        function close(){ lb.classList.remove('open'); lbImage.src = ''; document.body.style.overflow=''; }

        imgs.forEach(img => img.addEventListener('click', () => open(img.src)));
        lb.addEventListener('click', e=>{ if(e.target === lb || e.target === closeBtn) close(); });
        document.addEventListener('keydown', e=>{ if(e.key === 'Escape') close(); });
    })();
});

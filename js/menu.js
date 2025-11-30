// Function to handle hamburger label visibility on scroll
let lastScrollTop = 0;
const threshold = 50; // Amount of scroll before the menu starts changing
const minScale = 0.6; // Minimum size of the menu when scrolled
let isScrolling;

// Prefer the new checkbox/label combination; fallback to previous .menu if present
const hamburgerLabel = document.querySelector('label[for="menu_checkbox"]') || document.querySelector('.menu');

if (hamburgerLabel) {
    window.addEventListener('scroll', () => {
        clearTimeout(isScrolling);

        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > threshold) {
            const scale = Math.max(minScale, 1 - (currentScroll - threshold) / 500);
            const opacity = Math.max(0.25, 1 - (currentScroll - threshold) / 500);

            hamburgerLabel.style.transform = `scale(${scale})`;
            hamburgerLabel.style.opacity = opacity;
            hamburgerLabel.classList.add('hamburger-scrolling');
        } else {
            hamburgerLabel.style.transform = 'scale(1)';
            hamburgerLabel.style.opacity = '1';
            hamburgerLabel.classList.remove('hamburger-scrolling');
        }

        lastScrollTop = currentScroll;

        // Reset when scrolling stops
        isScrolling = setTimeout(() => {
            hamburgerLabel.style.opacity = '1';
            hamburgerLabel.style.transform = 'scale(1)';
            hamburgerLabel.classList.remove('hamburger-scrolling');
        }, 160);
    });
}
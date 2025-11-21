const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (!navToggle || !navLinks) return;

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 700 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});
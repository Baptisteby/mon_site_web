// Script cartoon pour la page Golfslinger
// Ajoutez ici vos interactions personnalisées !

// Exemple : effet sonore cartoon sur les boutons principaux
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.golfslinger-links a');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Effet sonore cartoon (remplacez par votre propre son si besoin)
            // let audio = new Audio('sound/cartoon-pop.mp3');
            // audio.play();
            // Pour l'instant, simple effet visuel
            btn.style.transform = 'scale(1.1) rotate(-2deg)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
});

// Carrousel 3D visible pour la page golfslinger.html
window.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('.gs-carousel-video');
    const prevBtn = document.querySelector('.gs-carousel-btn-prev');
    const nextBtn = document.querySelector('.gs-carousel-btn-next');
    if (!videos.length || !prevBtn || !nextBtn) return;
    let current = 0;
    function updateCarousel() {
        videos.forEach((v, i) => {
            v.classList.remove('active');
            v.classList.remove('not-active');
        });
        videos.forEach((v, i) => {
            if (i === current) {
                v.classList.add('active');
            } else {
                v.classList.add('not-active');
            }
        });
    }
    prevBtn.addEventListener('click', () => {
        current = (current - 1 + videos.length) % videos.length;
        updateCarousel();
    });
    nextBtn.addEventListener('click', () => {
        current = (current + 1) % videos.length;
        updateCarousel();
    });
    updateCarousel();
});

// Menu burger animé pour golfslinger.html
(function () {
    const burger = document.querySelector('.gs-burger');
    const nav = document.getElementById('gs-nav-menu');
    if (!burger || !nav) return;
    function closeMenu() {
        burger.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
    }
    function openMenu() {
        burger.setAttribute('aria-expanded', 'true');
        nav.setAttribute('aria-hidden', 'false');
    }
    burger.addEventListener('click', function (e) {
        const expanded = burger.getAttribute('aria-expanded') === 'true';
        if (expanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    // Ferme le menu au clic sur un lien
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Smooth scroll
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
            closeMenu();
        });
    });
    // Ferme le menu au clic à l'extérieur
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            closeMenu();
        }
    });
    // Accessibilité : ferme au focus out
    nav.addEventListener('focusout', function (e) {
        if (!nav.contains(e.relatedTarget)) {
            closeMenu();
        }
    });
})();

// Bouton scroll to top (icône pépite)
document.addEventListener('DOMContentLoaded', function () {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;
    // Affiche le bouton seulement après un scroll
    function toggleScrollBtn() {
        if (window.scrollY > 200) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.pointerEvents = 'auto';
        } else {
            scrollBtn.style.opacity = '0.7';
            scrollBtn.style.pointerEvents = 'none';
        }
    }
    window.addEventListener('scroll', toggleScrollBtn);
    toggleScrollBtn();
    // Smooth scroll to top
    scrollBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Fond header dynamique et interactif (particules)
document.addEventListener('DOMContentLoaded', function () {
    const bg = document.querySelector('.gs-header-animated-bg');
    if (!bg) return;
    // Génère des particules
    const PARTICLE_COUNT = 18;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 18 + Math.random() * 32;
        p.style.width = p.style.height = size + 'px';
        p.style.left = (Math.random() * 100) + '%';
        p.style.top = (Math.random() * 100) + '%';
        p.style.animationDelay = (Math.random() * 7) + 's';
        bg.appendChild(p);
        particles.push(p);
    }
    // Interactivité : effet de léger déplacement selon la souris
    bg.parentElement.addEventListener('mousemove', function (e) {
        const rect = bg.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        particles.forEach((p, i) => {
            const dx = x * (8 + i % 3 * 6);
            const dy = y * (8 + (i % 5) * 4);
            p.style.transform = `translate(${dx}px, ${dy}px)`;
        });
    });
    bg.parentElement.addEventListener('mouseleave', function () {
        particles.forEach(p => {
            p.style.transform = '';
        });
    });
}); 
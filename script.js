document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    let progress = 0;

    // Cacher l'indicateur de scroll pendant le chargement
    const scrollIndicator = document.querySelector('.scroll-indicator');
    scrollIndicator.style.display = 'none';

    // Ajouter la classe loading au body
    document.body.classList.add('loading');

    // Initialiser les vidéos
    const heroVideo = document.getElementById('hero-video');
    const presentationVideo = document.getElementById('presentation-video');
    const reactorVideo = document.getElementById('reactor-video');

    // Fonction pour gérer le chargement des vidéos
    const handleVideoLoad = (video) => {
        video.play().catch(error => {
            console.log("La lecture automatique n'a pas pu démarrer:", error);
        });
    };

    // Gestionnaires d'événements pour les vidéos
    [heroVideo, presentationVideo, reactorVideo].forEach(video => {
        if (video) {
            video.addEventListener('loadeddata', () => handleVideoLoad(video));
        }
    });

    // Fonction pour mettre à jour la barre de progression
    const updateProgress = () => {
        if (progress < 100) {
            progress += Math.random() * 25;
            if (progress > 100) progress = 100;

            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;

            if (progress < 100) {
                setTimeout(updateProgress, 200);
            } else {
                // Une fois à 100%, on attend un peu puis on cache le loading screen
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        document.body.classList.remove('loading');
                        // Afficher et initialiser l'indicateur de scroll après le chargement
                        scrollIndicator.style.display = 'block';
                        updateScrollIndicator();
                    }, 500);
                }, 500);
            }
        }
    };

    // Démarrer l'animation de chargement
    setTimeout(updateProgress, 500);

    // Gestion du scroll fluide
    let isScrolling = false;
    const sections = document.querySelectorAll('section');
    let currentSectionIndex = 0;

    function scrollToSection(element) {
        if (!isScrolling) {
            isScrolling = true;
            element.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }

    // Gestion de la navigation
    document.querySelectorAll('.floating-nav li').forEach((item, index) => {
        item.addEventListener('click', () => {
            const targetSection = document.querySelectorAll('section')[index];
            if (targetSection) {
                scrollToSection(targetSection);
            }
        });
    });

    // Gestion du scroll avec la molette
    let lastScrollTime = 0;
    const scrollCooldown = 1000; // 1 seconde de délai entre les scrolls

    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown) {
            return;
        }

        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -window.innerHeight / 2 && rect.top <= window.innerHeight / 2;
        });

        if (currentSection) {
            e.preventDefault();
            const currentIndex = Array.from(sections).indexOf(currentSection);
            const direction = e.deltaY > 0 ? 1 : -1;
            const nextIndex = currentIndex + direction;

            if (nextIndex >= 0 && nextIndex < sections.length) {
                scrollToSection(sections[nextIndex]);
                lastScrollTime = now;
            }
        }
    }, { passive: false });

    // Mise à jour des points de navigation actifs
    const updateActiveNav = () => {
        const currentSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= -window.innerHeight / 2 && rect.top <= window.innerHeight / 2;
        });

        if (currentSection) {
            const index = Array.from(sections).indexOf(currentSection);
            document.querySelectorAll('.nav-dot').forEach((dot, i) => {
                dot.style.transform = i === index ? 'scale(1.5)' : 'scale(1)';
                dot.style.boxShadow = i === index ?
                    '0 0 15px rgba(255, 255, 255, 0.4)' :
                    '0 0 10px rgba(255, 255, 255, 0.2)';
            });
        }
    };

    // Observer pour les sections
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNav();
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    // Gestion des vidéos avec Intersection Observer
    const videoSections = document.querySelectorAll('.hero, .presentation, .chaos-reactor');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
                video.currentTime = 0; // Remet la vidéo au début
            }
        });
    }, { threshold: 0.5 }); // Déclenche quand 50% de la section est visible

    videoSections.forEach(section => {
        videoObserver.observe(section);
    });

    // Désactive la lecture automatique initiale des vidéos
    document.querySelectorAll('video').forEach(video => {
        video.pause();
    });

    // Menu Burger
    const burgerMenu = document.querySelector('.burger-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-content a');

    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : 'auto';
        // Cacher/montrer l'indicateur de scroll
        scrollIndicator.style.display = menuOverlay.classList.contains('active') ? 'none' : 'block';
    });

    // Fermer le menu quand un lien est cliqué
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Réafficher l'indicateur de scroll
            scrollIndicator.style.display = 'block';
        });
    });

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Réafficher l'indicateur de scroll
            scrollIndicator.style.display = 'block';
        }
    });

    // Gestion des boutons du menu burger
    document.querySelectorAll('.menu-button').forEach(button => {
        // Gestion du mouvement de la souris
        button.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = -((y - centerY) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;

            // Applique la transformation avec scale
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
            this.classList.add('hover-effect');
        });

        // Réinitialisation quand la souris quitte le bouton
        button.addEventListener('mouseleave', function () {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            this.classList.remove('hover-effect');
        });

        // Gestion du clic
        button.addEventListener('click', function (e) {
            // Effet ripple interactif
            const ripple = document.createElement('span');
            ripple.className = 'menu-ripple';
            ripple.style.left = `${e.offsetX}px`;
            ripple.style.top = `${e.offsetY}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            // Animation de feedback
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 400);

            const target = this.getAttribute('data-href');
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });

            // Ferme le menu après le clic
            document.querySelector('.menu-overlay').classList.remove('active');
            document.querySelector('.burger-menu').classList.remove('active');
        });
    });

    // Observer pour l'animation des sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    // Observer toutes les sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Gestion de l'indicateur de défilement
    function updateScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const sections = Array.from(document.querySelectorAll('section'));

        // Trouver la section active
        const activeSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        });

        if (activeSection) {
            const currentIndex = sections.indexOf(activeSection);
            const isLastSection = currentIndex === sections.length - 1;

            // Mettre à jour la visibilité et le comportement
            if (!isLastSection) {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'all';
                scrollIndicator.classList.add('animate');

                // Mise à jour du comportement du clic
                scrollIndicator.onclick = () => {
                    sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
                };
            } else {
                // Sur la dernière section, on scroll vers le haut
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'all';
                scrollIndicator.classList.add('animate');
                scrollIndicator.style.transform = 'translateX(-50%) rotate(180deg)';

                scrollIndicator.onclick = () => {
                    sections[0].scrollIntoView({ behavior: 'smooth' });
                };
            }
        }
    }

    // Écouter le défilement pour mettre à jour l'indicateur
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateScrollIndicator);
    });

    // Initialiser l'indicateur au chargement
    document.addEventListener('DOMContentLoaded', () => {
        // ...existing DOMContentLoaded code...
        updateScrollIndicator();
    });
});

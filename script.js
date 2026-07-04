document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. DATA ET INTERACTION DE LA BIBLIOTHÈQUE
    // ==========================================================================
    const projectsData = [
        { title: "SEOUL 100K", category: "FULL CREATIVE — 2024~26" },
        { title: "SPORTS IN MOTION", category: "FULL CREATIVE — 2025~26" },
        { title: "MOTION GRAPHIC", category: "EDITING — 2025~26" },
        { title: "THE KOREAN DREAM", category: "DESIGN — 2026" },
        { title: "K-FOOD EXPO", category: "DESIGN — 2026" },
        { title: "7979 SEOUL RUNNING CREW", category: "DESIGN — 2025~26" },
        { title: "2D/3D MOVIES", category: "FULL CREATIVE — 2019~21" }
    ];

    const bookItems = document.querySelectorAll(".book-item");
    const metaTitle = document.getElementById("meta-title");
    const metaCategory = document.getElementById("meta-category");

    function updateMeta(index) {
        if (index !== null && projectsData[index]) {
            metaTitle.innerHTML = projectsData[index].title;
            metaCategory.innerHTML = projectsData[index].category;
        } else {
            metaTitle.innerHTML = "&nbsp;";
            metaCategory.innerHTML = "&nbsp;";
        }
    }

    // --- LOGIQUE ORDINATEUR : SURVOL (HOVER) ---
    bookItems.forEach((book) => {
        const index = book.getAttribute("data-index");
        
        book.addEventListener("mouseenter", () => {
            if (window.innerWidth > 768) {
                updateMeta(index);
            }
        });

        book.addEventListener("mouseleave", () => {
            if (window.innerWidth > 768) {
                updateMeta(null);
            }
        });
    });

    // --- LOGIQUE MOBILE : EFFET AUTOMATIQUE AU SCROLL HORIZONTAL (INTERSECTION OBSERVER ENTIÈREMENT DYNAMIQUE) ---
    let mobileObserver = null;

    function initMobileObserver() {
        if (window.innerWidth <= 768) {
            if (!mobileObserver) {
                const observerOptions = {
                    root: document.querySelector('.shelf-container'), 
                    rootMargin: "0px -42% 0px -42%", 
                    threshold: 0.05
                };

                mobileObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const index = entry.target.getAttribute("data-index");
                        
                        if (entry.isIntersecting) {
                            bookItems.forEach(b => b.classList.remove("is-active"));
                            entry.target.classList.add("is-active");
                            updateMeta(index);
                        }
                    });
                }, observerOptions);

                bookItems.forEach(book => mobileObserver.observe(book));
            }
        } else {
            if (mobileObserver) {
                mobileObserver.disconnect();
                mobileObserver = null;
                bookItems.forEach(b => b.classList.remove("is-active"));
                updateMeta(null);
            }
        }
    }

    // Initialisation
    initMobileObserver();

    // Gestion propre du redimensionnement de la fenêtre
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initMobileObserver, 150);
    });

    // ==========================================================================
    // 2. INDICATEUR DE SURLIGNAGE DU HEADER (NAV MAGIQUE)
    // ==========================================================================
    const navWrapper = document.querySelector(".nav-links-wrapper");
    const navLinks = document.querySelectorAll(".nav-link");
    const indicator = document.querySelector(".nav-line-indicator");

    function positionIndicator(link) {
        if (!link || !indicator) return;
        const wrapperRect = navWrapper.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        const leftPosition = linkRect.left - wrapperRect.left;
        const width = linkRect.width;

        indicator.style.left = `${leftPosition}px`;
        indicator.style.width = `${width}px`;
    }

    navLinks.forEach(link => {
        link.addEventListener("mouseenter", () => positionIndicator(link));
    });

    navWrapper.addEventListener("mouseleave", () => {
        const activeLink = document.querySelector(".nav-link.active");
        if (activeLink) {
            positionIndicator(activeLink);
        } else {
            if (indicator) indicator.style.width = "0px";
        }
    });

    const currentActive = document.querySelector(".nav-link.active");
    if (currentActive) {
        positionIndicator(currentActive);
    }
});

// Défilement fluide
document.querySelectorAll('a[href="#plans"], [href="#works"], a[href="#contact"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); 
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

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

    // --- LOGIQUE MOBILE : EFFET HOVER AUTOMATIQUE AU SCROLL (INTERSECTION OBSERVER) ---
    if (window.innerWidth <= 768) {
        const observerOptions = {
            root: null,
            rootMargin: "-25% 0px -25% 0px", // Cible le quart central vertical de l'écran du mobile
            threshold: 0.6 // S'active quand 60% du livre est dans cette zone centrale
        };

        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const index = entry.target.getAttribute("data-index");
                
                if (entry.isIntersecting) {
                    // Supprime l'état actif des autres livres et l'applique au livre centré
                    bookItems.forEach(b => b.classList.remove("is-active"));
                    entry.target.classList.add("is-active");
                    updateMeta(index);
                }
            });
        }, observerOptions);

        bookItems.forEach(book => mobileObserver.observe(book));
    }

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
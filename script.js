document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. DATA ET METADONNEES DE LA BIBLIOTHEQUE (6 PROJETS ALIGNÉS)
    // ==========================================================================
    const projectsData = [
        { title: "SEOUL 100K", category: "FULL CREATIVE — DIRECTION" },       // Index 0
        { title: "SPORTS IN MOTION", category: "MOTION DESIGN — 2026" },     // Index 1
        { title: "THE KOREAN DREAM", category: "BRANDING & DESIGN" },         // Index 2
        { title: "VJING / MOTION", category: "AFTER EFFECTS — DIGITAL" },    // Index 3
        { title: "HANJI CRAFTSMANSHIP", category: "TRADITIONAL VISUALS" },   // Index 4
        { title: "NEW CREATIVE", category: "VISUAL ARTS & DESIGN" }          // Index 5 (Nouveau)
    ];

    const bookItems = document.querySelectorAll(".book-item");
    const metaTitle = document.getElementById("meta-title");
    const metaCategory = document.getElementById("meta-category");

    function updateMeta(index) {
        if (metaTitle && metaCategory) {
            if (index !== null && projectsData[index]) {
                metaTitle.innerText = projectsData[index].title;
                metaCategory.innerText = projectsData[index].category;
            } else {
                metaTitle.innerHTML = "&nbsp;";
                metaCategory.innerHTML = "&nbsp;";
            }
        }
    }

    // Gestion du survol (PC)
    bookItems.forEach((book) => {
        const index = parseInt(book.getAttribute("data-index"), 10);
        
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

    // ==========================================================================
    // 2. INDICATEUR DE SURLIGNAGE DU HEADER
    // ==========================================================================
    const navWrapper = document.querySelector(".nav-links-wrapper");
    const navLinks = document.querySelectorAll(".nav-link");
    const indicator = document.querySelector(".nav-line-indicator");

    function positionIndicator(link) {
        if (!link || !indicator || !navWrapper) return;
        const wrapperRect = navWrapper.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        const leftPosition = linkRect.left - wrapperRect.left;
        const width = linkRect.width;

        indicator.style.left = `${leftPosition}px`;
        indicator.style.width = `${width}px`;
    }

    if (navLinks.length > 0 && indicator) {
        navLinks.forEach(link => {
            link.addEventListener("mouseenter", () => positionIndicator(link));
        });

        navWrapper.addEventListener("mouseleave", () => {
            const activeLink = document.querySelector(".nav-link.active");
            if (activeLink) {
                positionIndicator(activeLink);
            } else {
                indicator.style.width = "0px";
            }
        });

        const currentActive = document.querySelector(".nav-link.active");
        if (currentActive) {
            positionIndicator(currentActive);
        }
    }
});

// Défilement fluide pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault(); 
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});



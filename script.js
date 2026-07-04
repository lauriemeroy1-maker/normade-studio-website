document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. DATA ET INTERACTION DE LA BIBLIOTHÈQUE (5 PROJETS RECONFIGURÉS)
    // ==========================================================================
    const projectsData = [
        { title: "SEOUL 100K", category: "FULL CREATIVE — DIRECTION" },       // Index 0
        { title: "SPORTS IN MOTION", category: "MOTION DESIGN — 2026" },     // Index 1
        { title: "THE KOREAN DREAM", category: "BRANDING & DESIGN" },         // Index 2
        { title: "VJING / MOTION", category: "AFTER EFFECTS — DIGITAL" },    // Index 3
        { title: "HANJI CRAFTSMANSHIP", category: "TRADITIONAL VISUALS" }    // Index 4
    ];

    const bookItems = document.querySelectorAll(".book-item");
    const metaTitle = document.getElementById("meta-title");
    const metaCategory = document.getElementById("meta-category");

    function updateMeta(index) {
        if (index !== null && projectsData[index]) {
            metaTitle.innerText = projectsData[index].title;
            metaCategory.innerText = projectsData[index].category;
        } else {
            metaTitle.innerHTML = "&nbsp;";
            metaCategory.innerHTML = "&nbsp;";
        }
    }

    // --- LOGIQUE ORDINATEUR : SURVOL (HOVER) ---
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

    // --- LOGIQUE MOBILE : INTERSECTION OBSERVER ADAPTÉ AUX PAYSAGES TACTILES ---
    let mobileObserver = null;

    function initMobileObserver() {
        if (window.innerWidth <= 768) {
            if (!mobileObserver) {
                const observerOptions = {
                    root: document.querySelector('.shelf-container'), 
                    rootMargin: "0px -30% 0px -30%", 
                    threshold: 0.1
                };

                mobileObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const index = parseInt(entry.target.getAttribute("data-index"), 10);
                        
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

    initMobileObserver();

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initMobileObserver, 150);
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


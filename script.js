document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 0. GESTION DU SON DE LA VIDÉO HERO
    // ==========================================================================
    const heroVideo = document.getElementById("heroVideo");
    const soundToggle = document.getElementById("soundToggle");

    if (heroVideo && soundToggle) {
        soundToggle.addEventListener("click", () => {
            heroVideo.muted = !heroVideo.muted;
            soundToggle.classList.toggle("is-unmuted", !heroVideo.muted);

            if (!heroVideo.muted) {
                heroVideo.play().catch(() => {});
            }
        });
    }

    // ==========================================================================
    // 1. GESTION TEXTES ET OUVERTURE DE LIGHTBOX
    // ==========================================================================
    const projectsData = [
        { title: "SEOUL 100K", category: "FULL CREATIVE — DIRECTION" },       
        { title: "SPORTS IN MOTION", category: "MOTION DESIGN — 2026" },     
        { title: "THE KOREAN DREAM", category: "BRANDING & DESIGN" },         
        { title: "VJING / MOTION", category: "AFTER EFFECTS — DIGITAL" },    
        { title: "HANJI CRAFTSMANSHIP", category: "TRADITIONAL VISUALS" },   
        { title: "NEW CREATIVE", category: "VISUAL ARTS & DESIGN" }          
    ];

    const bookItems = document.querySelectorAll(".book-item");
    const metaTitle = document.getElementById("meta-title");
    const metaCategory = document.getElementById("meta-category");

    const lightbox = document.getElementById("project-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.querySelector(".lightbox-close");

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

        const coverElement = book.querySelector(".cover");
        const mobileInfoElement = book.querySelector(".mobile-project-info");

        const openProjectAction = (e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            
            const imageUrl = book.getAttribute("data-image");
            if (imageUrl && lightbox && lightboxImg) {
                lightboxImg.src = imageUrl;
                lightbox.style.display = "block";
                document.body.classList.add("lightbox-active");
            }
        };

        if (coverElement) {
            coverElement.addEventListener("click", openProjectAction);
        }

        if (mobileInfoElement) {
            mobileInfoElement.addEventListener("click", openProjectAction);
        }
    });

    if (lightbox && lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
        
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.style.display = "none";
            document.body.classList.remove("lightbox-active");
        }
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLightbox();
        }
    });

    // ==========================================================================
    // 2. INDICATEUR DE DE SURLIGNAGE DE BARRE DE NAVIGATION
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        if (targetId === '#works') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }

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

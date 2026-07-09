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
    // 1. SYSTEME INTERACTIF DE GLISSEMENT DE COUVERTURE & GRAVITE RETOUR
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

    let activeItem = null;
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let hasMoved = false;

    bookItems.forEach((book) => {
        const index = parseInt(book.getAttribute("data-index"), 10);
        
        book.addEventListener("mouseenter", () => {
            if (window.innerWidth > 768 && !isDragging) updateMeta(index);
        });

        book.addEventListener("mouseleave", () => {
            if (window.innerWidth > 768 && !isDragging) updateMeta(null);
        });

        // Bloque l'ouverture de lien si le livre a été déplacé
        book.addEventListener("click", (e) => {
            if (hasMoved) {
                e.preventDefault();
            }
        });

        book.addEventListener("mousedown", (e) => {
            if (window.innerWidth <= 768) return; 
            if (e.button !== 0) return; // Clic gauche uniquement

            activeItem = book;
            isDragging = true;
            hasMoved = false;
            
            book.classList.remove("returning");
            book.classList.add("dragging");

            startX = e.clientX;
            startY = e.clientY;
            
            e.preventDefault();
        });
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging || !activeItem) return;

        const card = activeItem.querySelector('.book-card');
        if (!card) return;

        currentX = e.clientX - startX;
        currentY = e.clientY - startY;

        if (Math.abs(currentX) > 6 || Math.abs(currentY) > 6) {
            hasMoved = true;
        }

        // Déplace physiquement la carte sous le curseur
        card.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.03)`;
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging || !activeItem) return;

        const card = activeItem.querySelector('.book-card');
        
        activeItem.classList.remove("dragging");
        activeItem.classList.add("returning");

        if (card) {
            // Relâchement : retour à l'origine avec la physique CSS cubique
            card.style.transform = "translate(0px, 0px)";
        }

        // Si simple clic hold sans bouger d'un poil : ouvre le projet
        if (!hasMoved) {
            const targetUrl = activeItem.getAttribute("href");
            if (targetUrl && targetUrl !== "#") {
                window.location.href = targetUrl;
            }
        }

        isDragging = false;
        activeItem = null;
    });

    // ==========================================================================
    // 2. INDICATEUR DE DE DE LA BARRE DE NAVIGATION
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
            if (activeLink) positionIndicator(activeLink);
            else indicator.style.width = "0px";
        });
    }
});

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
    // 1. SURVOL ET LOGIQUE INTERACTIVE DE DRAG & DROP (GRAVITÉ)
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

    // Variables globales pour le moteur de drag & drop
    let activeItem = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasMovedSignificant = false; // Permet de faire la diff entre un simple clic et un glissé

    bookItems.forEach((book) => {
        const index = parseInt(book.getAttribute("data-index"), 10);
        const card = book.querySelector('.book-card');
        
        book.addEventListener("mouseenter", () => {
            if (window.innerWidth > 768 && !isDragging) updateMeta(index);
        });

        book.addEventListener("mouseleave", () => {
            if (window.innerWidth > 768 && !isDragging) updateMeta(null);
        });

        // Empêcher l'action par défaut du lien au clic direct s'il y a eu déplacement
        book.addEventListener("click", (e) => {
            if (hasMovedSignificant) {
                e.preventDefault();
            }
        });

        // Début du clic-hold
        book.addEventListener("mousedown", (e) => {
            if (window.innerWidth <= 768) return; // Désactivé sur mobile pour le scroll fluide
            
            // Ne s'active qu'avec le clic gauche principal
            if (e.button !== 0) return;

            activeItem = book;
            isDragging = true;
            hasMovedSignificant = false;
            
            book.classList.remove("returning");
            book.classList.add("dragging");

            startX = e.clientX;
            startY = e.clientY;
            
            e.preventDefault();
        });
    });

    // Écoute globale des mouvements pour un drag fluide
    window.addEventListener("mousemove", (e) => {
        if (!isDragging || !activeItem) return;

        const card = activeItem.querySelector('.book-card');
        if (!card) return;

        currentX = e.clientX - startX;
        currentY = e.clientY - startY;

        // Seuil physique pour valider l'action de drag
        if (Math.abs(currentX) > 5 || Math.abs(currentY) > 5) {
            hasMovedSignificant = true;
        }

        // Translation en temps réel sous la souris
        card.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.04)`;
    });

    // Relâchement (effet Gravité / Ressort)
    window.addEventListener("mouseup", () => {
        if (!isDragging || !activeItem) return;

        const card = activeItem.querySelector('.book-card');
        
        activeItem.classList.remove("dragging");
        activeItem.classList.add("returning");

        if (card) {
            // Remise à zéro immédiate de la position (la physique amortie est gérée par la transition CSS .returning)
            card.style.transform = `translate(0px, 0px)`;
        }

        // Si l'utilisateur a simplement fait un clic rapide sans déplacer l'élément, on suit le lien du projet
        if (!hasMovedSignificant) {
            const targetUrl = activeItem.getAttribute("href");
            if (targetUrl && targetUrl !== "#") {
                window.location.href = targetUrl;
            }
        }

        // Reset des états
        isDragging = false;
        activeItem = null;
    });

    // ==========================================================================
    // 2. INDICATEUR DE SURLIGNAGE DE LA BARRE DE NAVIGATION
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

// Déplacement fluide vers les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        if (targetId === '#works') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault(); 
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

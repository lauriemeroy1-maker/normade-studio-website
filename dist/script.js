// Défilement fluide uniquement pour Pricing (#plans) et Contact (#contact)
document.querySelectorAll('a[href="#plans"], a[href="#contact"]').forEach(anchor => {
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


// ==========================================================================
// CODE JS CORRECTIF POUR L'ANIMATION (SÉCURISÉ CONTRE LES DOUBLONS)
// ==========================================================================

// Enregistre le plugin
gsap.registerPlugin(ScrollTrigger);

// Sélectionne les cartes uniques
const cards = gsap.utils.toArray(".card-content");

// On applique l'effet une seule fois par élément
cards.forEach((card, i) => {
  
  gsap.to(card, {
    scale: 0.9,          // Réduction de taille
    opacity: 0.7,        // Transparence
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.4)",
    
    // SÉCURITÉ : Empêche une double animation d'entrer en conflit
    overwrite: "auto", 
    
    scrollTrigger: {
      trigger: card,
      start: "top 140px",  // Déclenche quand la carte se bloque
      end: "bottom 140px", // S'arrête quand la carte suivante l'a recouverte
      scrub: true,         // Suit le mouvement du scroll de façon fluide
      
      // Indique à GSAP quoi faire si l'utilisateur scrolle très vite vers le haut ou le bas
      toggleActions: "play none none reverse" 
    }
  });
});

// ==========================================================================
// 2. MÉCANIQUE DE LA LIGNE DE NAVIGATION MAGIQUE (INDICATEUR CONTINU)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector('.nav-links-wrapper');
    const links = document.querySelectorAll('.nav-link');
    const indicator = document.querySelector('.nav-line-indicator');

    // Fonction pour déplacer l'indicateur noir sous un élément précis
    function moveIndicator(element) {
        const linkRect = element.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        
        const leftPosition = linkRect.left - wrapperRect.left;
        const linkWidth = linkRect.width;

        indicator.style.left = `${leftPosition}px`;
        indicator.style.width = `${linkWidth}px`;
    }

    // ÉTAPE 1 : Caler la ligne noire sous l'onglet actif au chargement
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) {
        // Un léger timeout permet d'attendre que la police personnalisée soit bien chargée
        setTimeout(() => {
            moveIndicator(activeLink);
            indicator.style.opacity = '1';
        }, 100);
    }

    // ÉTAPE 2 : Déplacer la ligne lors du survol (Hover)
    links.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            indicator.style.opacity = '1';
            moveIndicator(e.target);
        });
    });

    // ÉTAPE 3 : Retour à l'onglet actif initial quand la souris quitte le menu global
    wrapper.addEventListener('mouseleave', () => {
        const currentActive = document.querySelector('.nav-link.active');
        if (currentActive) {
            moveIndicator(currentActive);
        } else {
            indicator.style.opacity = '0'; // Cache la ligne si aucun onglet n'est actif
        }
    });
});
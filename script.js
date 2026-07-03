/* ============ THEME TOGGLE ============ */
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    themeToggle.innerHTML = document.documentElement.classList.contains('dark') ? '☀️ Mode clair' : '🌙 Mode sombre';
});

/* ============ MENU MOBILE ============ */
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const navLinks = document.querySelectorAll('.nav-link');

function openMenu() {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}
function closeMenu() {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}
menuBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);
navLinks.forEach(link => link.addEventListener('click', closeMenu));

/* ============ REVEAL AU SCROLL ============ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { root: null, threshold: 0.05, rootMargin: "0px 0px -20px 0px" });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============ SCROLLSPY NAVIGATION ============ */
const sections = document.querySelectorAll('main section[id]');
const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const link = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('is-active'));
            link.classList.add('is-active');
        }
    });
}, { root: null, threshold: 0.4 });
sections.forEach(sec => spyObserver.observe(sec));

/* ============ DONNÉES PROJETS ============ */
const projectsData = {
    taskmanager: {
        title: "Task-manager",
        badge: "Application Web · Productivité",
        image: "assets/my-app.jpeg",
        type: "Application web",
        status: "En ligne",
        role: "Conception & développement front-end, intégration Firebase",
        overview: "Gestionnaire de tâches pensé pour organiser le quotidien sans friction : création rapide de tâches, catégorisation et suivi visuel de l'avancement, avec des données synchronisées instantanément entre tous les appareils de l'utilisateur.",
        features: [
            "Authentification sécurisée par email/mot de passe via Firebase Auth",
            "Création, édition et suppression de tâches avec catégories personnalisées",
            "Synchronisation temps réel des données grâce à Firestore",
            "Système de priorités et de dates d'échéance avec repères visuels",
            "Interface responsive optimisée mobile-first"
        ],
        stack: ["Firebase Auth", "Firestore", "JavaScript ES6", "Tailwind CSS"],
        challenge: "Garantir une synchronisation fluide en temps réel entre plusieurs sessions ouvertes simultanément, sans latence perceptible ni conflit d'écriture sur les mêmes documents Firestore.",
        link: "https://my-app-omega-one-21.vercel.app",
        linkLabel: "Visiter le projet"
    },
    portfolio: {
        title: "Portfolio Pro",
        badge: "Site Vitrine · UX/UI",
        image: "assets/cv-web.png",
        type: "Site vitrine",
        status: "En ligne",
        role: "Design UI, intégration et développement complet en solo",
        overview: "Vitrine personnelle conçue comme un outil de conversion : chaque section guide le visiteur vers une action claire, avec une attention particulière portée aux micro-interactions et à la lisibilité en mode clair comme sombre.",
        features: [
            "Design responsive mobile-first avec breakpoints soignés",
            "Animations au scroll pilotées par Intersection Observer",
            "Bascule clair/sombre instantanée sans rechargement",
            "Formulaire de contact structuré et accessible au clavier",
            "Chargement rapide : aucun framework lourd, uniquement HTML/CSS/JS"
        ],
        stack: ["HTML5", "Tailwind CSS", "JavaScript vanilla"],
        challenge: "Obtenir un rendu premium et des animations fluides sans dépendre d'un framework front-end, afin de garder un temps de chargement minimal sur tous les appareils.",
        link: "https://mon-portfolio-ten-topaz.vercel.app",
        linkLabel: "Visiter le projet"
    },
    api: {
        title: "API Secure & Scalable",
        badge: "Backend · Architecture API",
        image: "assets/api-swagger.png",
        type: "API REST documentée",
        status: "Live on Render",
        role: "Architecture, développement backend et documentation technique",
        overview: "Infrastructure backend découplée conçue pour supporter l'ajout continu de nouveaux modules métier. L'accent est mis sur un typage strict, une sécurité stricte par endpoint et une documentation interactive utilisable par n'importe quelle équipe front-end.",
        features: [
            "Authentification JWT avec gestion fine des rôles et permissions",
            "Typage strict de bout en bout avec TypeScript",
            "Modélisation relationnelle et NoSQL via TypeORM et MongoDB",
            "Documentation interactive Swagger/OpenAPI auto-générée",
            "Rate limiting, validation stricte des entrées et gestion centralisée des erreurs",
            "Déploiement continu sur Render avec variables d'environnement sécurisées"
        ],
        stack: ["TypeScript", "Node.js / Express", "TypeORM", "MongoDB", "JWT Auth", "Swagger"],
        challenge: "Concevoir une architecture suffisamment découplée pour absorber de nouveaux modules métier sans régression, tout en maintenant un niveau de sécurité strict sur chaque endpoint exposé.",
        link: "https://mon-api-vnhx.onrender.com/api-docs",
        linkLabel: "Voir la documentation API"
    },
    methshop: {
        title: "Meth-Shop",
        badge: "E-Commerce · Full-Stack",
        image: "assets/e-commerce.jpeg",
        type: "Application e-commerce",
        status: "Live on Vercel",
        role: "Développement full-stack, intégration paiement et déploiement",
        overview: "Boutique en ligne complète couvrant tout le parcours d'achat : découverte du catalogue, gestion du panier, paiement sécurisé et suivi des commandes, avec un espace d'administration dédié à la gestion du stock.",
        features: [
            "Catalogue produits filtrable avec recherche dynamique",
            "Panier d'achat persistant, synchronisé entre le stockage local et le serveur",
            "Paiement sécurisé intégré via Stripe",
            "Authentification JWT avec espace client et historique de commandes",
            "Dashboard admin pour la gestion des produits et des commandes",
            "Base de données hébergée dans le cloud via MongoDB Atlas"
        ],
        stack: ["Next.js", "MongoDB Atlas", "Stripe API", "JWT Auth", "Tailwind CSS", "Vercel"],
        challenge: "Synchroniser le panier entre le stockage local et le serveur pour éviter toute perte de données lors du checkout, tout en sécurisant le flux de paiement Stripe côté serveur.",
        link: "https://meth-shop.vercel.app",
        linkLabel: "Visiter la boutique"
    }
};

/* ============ MODALE PROJET (fiche détaillée) ============ */
const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
let lastFocusedElement = null;

function renderProject(id) {
    const data = projectsData[id];
    if (!data) return false;

    document.getElementById('modal-image').src = data.image;
    document.getElementById('modal-image').alt = data.title;
    document.getElementById('modal-badge').textContent = data.badge;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-overview').textContent = data.overview;
    document.getElementById('modal-role').textContent = data.role;
    document.getElementById('modal-type').textContent = data.type;
    document.getElementById('modal-status').textContent = data.status;
    document.getElementById('modal-challenge').textContent = data.challenge;

    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    data.features.forEach(f => {
        const li = document.createElement('li');
        li.className = 'flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed';
        li.innerHTML = `<span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-cobalt-500 flex-shrink-0"></span><span>${f}</span>`;
        featuresList.appendChild(li);
    });

    const stackWrap = document.getElementById('modal-stack');
    stackWrap.innerHTML = '';
    data.stack.forEach(s => {
        const span = document.createElement('span');
        span.className = 'text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg uppercase tracking-wide border border-slate-200/60 dark:border-slate-700/60';
        span.textContent = s;
        stackWrap.appendChild(span);
    });

    const linkEl = document.getElementById('modal-link');
    linkEl.href = data.link;
    document.getElementById('modal-link-label').textContent = data.linkLabel;

    document.title = `${data.title} — Mohamed Abdalah Fall`;
    return true;
}

function openProjectModal(id, updateHash = true) {
    if (!renderProject(id)) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add('open');
    document.body.classList.add('overflow-hidden');
    modal.querySelector('.modal-panel').scrollTop = 0;
    if (updateHash) history.pushState({ project: id }, '', `#projet-${id}`);
    modalClose.focus();
}

function closeProjectModal(updateHash = true) {
    modal.classList.remove('open');
    document.body.classList.remove('overflow-hidden');
    document.title = "Mohamed Abdalah Fall | Portfolio Premium";
    if (updateHash && location.hash.startsWith('#projet-')) {
        history.pushState({}, '', location.pathname + location.search);
    }
    if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll('.project-card').forEach(card => {
    const id = card.getAttribute('data-project');
    card.addEventListener('click', () => openProjectModal(id));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProjectModal(id);
        }
    });
});

modalClose.addEventListener('click', () => closeProjectModal());
modalBackdrop.addEventListener('click', () => closeProjectModal());
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeProjectModal();
});

window.addEventListener('popstate', () => {
    const hash = location.hash;
    if (hash.startsWith('#projet-')) {
        const id = hash.replace('#projet-', '');
        openProjectModal(id, false);
    } else {
        closeProjectModal(false);
    }
});

/* Ouverture directe si l'URL contient déjà un hash projet (partage de lien) */
window.addEventListener('DOMContentLoaded', () => {
    const hash = location.hash;
    if (hash.startsWith('#projet-')) {
        const id = hash.replace('#projet-', '');
        openProjectModal(id, false);
    }
});

/* ============ FORMULAIRE DE CONTACT (retour visuel) ============ */
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.classList.remove('hidden');
    contactForm.reset();
    setTimeout(() => formFeedback.classList.add('hidden'), 4000);
});
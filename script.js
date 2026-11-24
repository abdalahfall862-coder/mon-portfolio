const BASE_TITLE = "Mohamed Abdalah Fall | Portfolio · Développeur Full-Stack";

/* ============ THEME TOGGLE ============ */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

function syncThemeUI() {
    const isDark = document.documentElement.classList.contains('dark');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeLabel.textContent = isDark ? 'Mode clair' : 'Mode sombre';
    themeToggle.setAttribute('aria-label', isDark ? 'Activer le mode clair' : 'Activer le mode sombre');
}
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    syncThemeUI();
});
syncThemeUI();

/* ============ MENU MOBILE ============ */
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const navLinks = document.querySelectorAll('.nav-link');

function openMenu() {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden', 'menu-open');
    sidebar.scrollTop = 0;
    menuBtn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
}
function closeMenu() {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden', 'menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
}
menuBtn.setAttribute('aria-expanded', 'false');
menuBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
});

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
        links: [{ label: "Visiter le projet", url: "https://my-app-omega-one-21.vercel.app" }],
        card: {
            match: "MATCH 01", tag: "FINAL", span: "lg:col-span-2",
            imgAlt: "Task-manager", kick: "Application Web · Productivité",
            desc: "Gestionnaire de tâches intelligent avec authentification Firebase, synchronisation en temps réel entre appareils et interface épurée pensée pour la productivité quotidienne.",
            tags: [{ label: "Firebase", primary: true }, { label: "Tailwind / JS" }],
            link: { label: "Visiter le projet →", url: "https://my-app-omega-one-21.vercel.app" }
        }
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
        links: [{ label: "Visiter le projet", url: "https://mon-portfolio-ten-topaz.vercel.app" }],
        card: {
            match: "MATCH 02", tag: "FINAL", span: "lg:col-span-4", delay: "80ms",
            imgAlt: "Portfolio Pro", kick: "Site Vitrine · UX/UI",
            desc: "Vitrine personnelle haut de gamme avec micro-interactions fluides, mode sombre natif et structure UX pensée pour transformer les visiteurs en opportunités.",
            tags: [{ label: "HTML / Tailwind", primary: true }, { label: "Responsive" }],
            link: { label: "Visiter le projet →", url: "https://mon-portfolio-ten-topaz.vercel.app" }
        }
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
        architecture: [
            "Séparation en couches routes / services / repositories pour isoler la logique métier de l'accès aux données",
            "TypeORM choisi pour bénéficier d'entités typées et de migrations versionnées plutôt que des requêtes brutes",
            "Middleware d'authentification JWT centralisé, appliqué par groupe de routes selon les rôles requis",
            "Swagger généré à partir des schémas de validation pour que la documentation reste toujours synchronisée avec le code"
        ],
        challenge: "Concevoir une architecture suffisamment découplée pour absorber de nouveaux modules métier sans régression, tout en maintenant un niveau de sécurité strict sur chaque endpoint exposé.",
        links: [{ label: "Voir le code source sur GitHub", url: "https://github.com/abdalahfall862-coder/mon-api", variant: "primary" }],
        card: {
            match: "MATCH 03 · PRIME TIME · LIVE", tag: "MVP", span: "lg:col-span-6",
            featured: true, pad: "p-5", px: "px-2",
            imgAlt: "Mon API - Dexchange Infrastructure",
            imgWrap: "h-64 sm:h-72 rounded-[2rem] mb-6 overflow-hidden relative bg-slate-200 dark:bg-slate-800 shadow-inner",
            extraOverlay: '<div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>',
            kick: "Architecture Serveur & Algorithmie",
            desc: "Architecture backend découplée et sécurisée, orchestrant des flux de données complexes à haute disponibilité. Typage strict de bout en bout, authentification par rôles et documentation Swagger interactive.",
            tags: [
                { label: "TypeScript", primary: true, small: true },
                { label: "Node.js / Express", small: true },
                { label: "TypeORM", small: true },
                { label: "MongoDB", small: true },
                { label: "JWT Auth", small: true }
            ],
            link: { label: "Voir le code source →", url: "https://github.com/abdalahfall862-coder/mon-api" }
        }
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
        links: [{ label: "Visiter la boutique", url: "https://meth-shop.vercel.app" }],
        card: {
            match: "MATCH 04 · LIVE", tag: "FINAL", span: "lg:col-span-3",
            imgAlt: "Meth-Shop E-commerce", kick: "E-Commerce Full-Stack",
            desc: "Boutique en ligne complète : catalogue filtrable, panier persistant, paiement sécurisé via Stripe, authentification JWT et dashboard admin. Déployée sur Vercel avec MongoDB Atlas.",
            tags: [
                { label: "Next.js", primary: true },
                { label: "MongoDB Atlas" },
                { label: "Stripe API" },
                { label: "JWT Auth" }
            ],
            link: { label: "Visiter la boutique →", url: "https://meth-shop.vercel.app" }
        }
    },
    tarteel: {
        title: "Tarteel",
        badge: "Mobile · Apprentissage du Coran",
        image: "assets/tarteel.PNG",
        type: "Application iOS & Android",
        status: "Disponible sur les deux stores",
        role: "Conception produit, développement mobile et dashboard admin web",
        overview: "Tarteel est une application d'apprentissage et de mémorisation du Coran, reconnaissable à sa loutre mascotte. Elle accompagne l'utilisateur du premier verset jusqu'à la mémorisation complète grâce à un parcours structuré, une récitation vocale évaluée, des révisions espacées et un suivi de progression précis — sur mobile comme sur le dashboard admin web.",
        features: [
            "Parcours d'apprentissage structuré par juz, sourate et niveau de mémorisation",
            "Récitation vocale avec retour immédiat sur la prononciation et le tajwid",
            "Révisions intelligentes espacées et rappels quotidiens personnalisés",
            "Lecture du Coran avec traductions, tafsir et signets synchronisés",
            "Statistiques de progression, séries d'apprentissage, objectifs et badges",
            "Mode hors-ligne, notifications push et synchronisation multi-appareils",
            "Dashboard admin web : utilisateurs, contenus, niveaux, modération et analytics"
        ],
        stack: ["React Native / Expo", "TypeScript", "Node.js", "Firebase", "PostgreSQL", "Next.js (admin)"],
        architecture: [
            "Application mobile partagée iOS/Android avec couche de données locale pour un fonctionnement hors-ligne, puis synchronisation différentielle à la reconnexion",
            "Traitement de la récitation côté serveur : transcription vocale, comparaison avec le texte de référence et retour pédagogique sur les erreurs de tajwid",
            "Moteur de révisions espacées (SRS) qui adapte les rappels à la difficulté réelle de chaque verset pour l'utilisateur",
            "Dashboard admin web séparé, alimenté par les mêmes API, avec gestion des contenus, suivi des cohortes et analytics d'engagement"
        ],
        challenge: "Conciler la capture et l'analyse audio en temps réel avec une expérience fluide sur mobile, tout en maintenant une synchronisation fiable hors-ligne et en donnant à l'équipe administrative une vision claire de la progression des apprenants.",
        links: [
            { label: "Télécharger sur l'App Store", url: "https://apps.apple.com/sn/app/tarteel/id6795987191", variant: "primary" },
            { label: "Disponible sur Google Play", url: "https://play.google.com/store/apps/details?id=com.tarteel.sn", variant: "primary" },
            { label: "Voir la page de présentation", url: "https://tarteel.sn", variant: "secondary" },
            { label: "Dashboard admin (code source)", url: "https://github.com/abdalahfall862-coder/dashboard-admin", variant: "secondary" }
        ],
        card: {
            match: "MATCH 05", tag: "LIVE", span: "lg:col-span-3", delay: "120ms",
            imgAlt: "Tarteel — application d'apprentissage du Coran",
            imgWrap: "h-48 sm:h-56 rounded-[2rem] mb-5 overflow-hidden relative bg-gradient-to-br from-orange-500/20 via-amber-500/5 to-slate-900/10 dark:from-orange-500/25 dark:via-slate-800 dark:to-slate-900",
            imgFit: "object-contain p-2",
            kick: "Mobile · Éducation Islamique",
            desc: "Application d'apprentissage et de mémorisation du Coran : récitation vocale, suivi de progression et révisions intelligentes. Disponible sur l'App Store et Google Play.",
            tags: [{ label: "iOS / Android", primary: true }]
        }
    }
};

/* ============ CARTES PROJETS (générées depuis projectsData) ============ */
const TAG_PRIMARY = 'text-[10px] font-extrabold bg-orange-500/15 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-lg uppercase tracking-wide';
const TAG_SECONDARY = 'text-[10px] font-bold bg-black/10 dark:bg-white/10 ink2 px-3 py-1.5 rounded-lg uppercase tracking-wide';
const TAG_PRIMARY_SM = 'text-[9px] font-extrabold bg-orange-500/15 text-orange-700 dark:text-orange-300 px-2.5 py-1.5 rounded-lg uppercase';
const TAG_SECONDARY_SM = 'text-[9px] font-bold bg-black/10 dark:bg-white/10 ink2 px-2.5 py-1.5 rounded-lg uppercase';

function renderProjectCards() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const html = Object.entries(projectsData).map(([id, d]) => {
        const c = d.card;
        if (!c) return '';
        const featured = !!c.featured;
        const pad = c.pad || 'p-4';
        const px = c.px || 'px-3';
        const delay = c.delay ? ` style="transition-delay:${c.delay}"` : '';
        const imgWrap = c.imgWrap || 'h-48 sm:h-56 rounded-[2rem] mb-5 overflow-hidden relative bg-slate-200 dark:bg-slate-800';
        const imgFit = c.imgFit || 'object-cover';
        const tags = c.tags.map(t => {
            const cls = t.small
                ? (t.primary ? TAG_PRIMARY_SM : TAG_SECONDARY_SM)
                : (t.primary ? TAG_PRIMARY : TAG_SECONDARY);
            return `<span class="${cls}">${t.label}</span>`;
        }).join('');
        const body = featured
            ? `<div><span class="kick block mb-1">${c.kick}</span><h3 class="font-display text-3xl sm:text-4xl ink group-hover:text-hoop transition-colors">${d.title}</h3></div>
                               <p class="ink2 font-normal text-sm sm:text-base leading-relaxed max-w-3xl">${c.desc}</p>
                               <div class="flex flex-wrap gap-1.5 pt-1">${tags}</div>`
            : `<span class="kick block mb-1">${c.kick}</span>
                               <h3 class="font-display text-3xl ink mb-2 group-hover:text-hoop transition-colors">${d.title}</h3>
                               <p class="ink2 mb-5 font-normal text-sm leading-relaxed">${c.desc}</p>
                               <div class="flex flex-wrap gap-2">${tags}</div>`;
        const link = c.link
            ? `<a href="${c.link.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="relative z-10 mt-4 inline-flex items-center gap-2 text-xs font-bold text-hoop hover:opacity-80 transition-opacity">${c.link.label}</a>`
            : '';
        const bodyClass = featured ? 'px-2 pb-2 space-y-4' : 'px-3 pb-3';
        return `<article class="project-card reveal group panel ${pad} rounded-[2.5rem] hover:-translate-y-2 hover:border-hoop/50 transition-all duration-500 ease-out cursor-pointer ${c.span}"${delay} data-project="${id}" role="button" tabindex="0" aria-label="Voir les détails du projet ${d.title}">
                        <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 ${px} pb-3"><span class="font-led match-label text-[10px] font-bold text-hoop">${c.match}</span><span class="led-tag">${c.tag}</span></div>
                        <div class="${imgWrap}">
                            <img src="${d.image}" alt="${c.imgAlt}" class="w-full h-full ${imgFit} transition-transform duration-700 group-hover:scale-105">
                            ${c.extraOverlay || ''}
                            <div class="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/25 transition-colors flex items-center justify-center">
                                <span class="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-white text-xs font-extrabold uppercase tracking-widest bg-hoop px-4 py-2 rounded-xl">Voir la fiche projet</span>
                            </div>
                        </div>
                        <div class="${bodyClass}">${body}${link}</div>
                    </article>`;
    }).join('');
    grid.insertAdjacentHTML('afterbegin', html);
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
renderProjectCards();

/* ============ MODALE PROJET (fiche détaillée) ============ */
const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
let lastFocusedElement = null;

function renderProject(id) {
    const data = projectsData[id];
    if (!data) return false;

    const modalImage = document.getElementById('modal-image');
    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalImage.classList.toggle('portrait', /tarteel/i.test(data.image));
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
        li.className = 'flex items-start gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed';
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

    const archWrap = document.getElementById('modal-architecture-wrap');
    const archList = document.getElementById('modal-architecture');
    archList.innerHTML = '';
    if (data.architecture && data.architecture.length) {
        archWrap.classList.remove('hidden');
        data.architecture.forEach(a => {
            const li = document.createElement('li');
            li.className = 'flex items-start gap-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed';
            li.innerHTML = `<span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span><span>${a}</span>`;
            archList.appendChild(li);
        });
    } else {
        archWrap.classList.add('hidden');
    }

    const linksWrap = document.getElementById('modal-links');
    linksWrap.innerHTML = '';
    const links = data.links || [];
    links.forEach((item) => {
        const a = document.createElement('a');
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = item.label + ' →';
        a.className = item.variant === 'secondary'
            ? 'inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300'
            : 'inline-flex items-center justify-center w-full sm:w-auto px-7 py-4 bg-hoop text-white font-bold text-sm rounded-2xl shadow-xl shadow-orange-700/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300';
        linksWrap.appendChild(a);
    });

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
    document.title = BASE_TITLE;
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

/* ============ FORMULAIRE DE CONTACT (envoi réel via FormSubmit) ============ */
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');
const formFallback = document.getElementById('form-fallback');
const submitBtn = document.getElementById('contact-submit');
const submitLabel = document.getElementById('contact-submit-label');
const SUBMIT_LABEL = '🏀 Tirer au panier...';

if (contactForm && formFeedback && formFallback && submitBtn && submitLabel) {
    function setFeedback(message, kind) {
        formFeedback.textContent = message;
        formFeedback.className = kind === 'hidden'
            ? 'hidden text-xs font-bold text-center pt-1'
            : `text-xs font-bold text-center pt-1 ${kind === 'success' ? 'text-emerald-400' : 'text-rose-400'}`;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (submitBtn.disabled) return;

        const data = new FormData(contactForm);
        const name = String(data.get('name') || '').trim();
        const email = String(data.get('email') || '').trim();
        const message = String(data.get('message') || '').trim();
        const honey = String(data.get('_honey') || '');

        setFeedback('', 'hidden');
        formFallback.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitLabel.textContent = 'Envoi en cours...';

        // Honeypot : un bot remplit ce champ invisible, on simule un envoi réussi.
        if (honey) {
            contactForm.reset();
            setFeedback('Message envoyé, merci !', 'success');
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitLabel.textContent = SUBMIT_LABEL;
            return;
        }

        try {
            const response = await fetch('https://formsubmit.co/ajax/abdalafall862@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: 'Nouveau message depuis le portfolio',
                    _replyto: email,
                    _template: 'table',
                    _captcha: 'false',
                    _honey: honey,
                    name: name,
                    email: email,
                    message: message
                })
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const result = await response.json().catch(() => ({}));
            if (result.success === false) throw new Error(result.message || 'Envoi refusé');

            contactForm.reset();
            setFeedback('Message envoyé ! Je vous réponds rapidement.', 'success');
        } catch (error) {
            const href = 'mailto:abdalafall862@gmail.com?subject=' +
                encodeURIComponent('Message portfolio — ' + name) +
                '&body=' + encodeURIComponent(message + '\n\n— ' + name + '\n' + email);
            formFallback.textContent = 'Envoi indisponible pour le moment. ';
            const link = document.createElement('a');
            link.href = href;
            link.className = 'font-bold text-hoop underline hover:opacity-80';
            link.textContent = 'Ouvrir votre messagerie →';
            formFallback.appendChild(link);
            formFallback.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitLabel.textContent = SUBMIT_LABEL;
        }
    });
}
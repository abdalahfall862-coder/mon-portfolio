/* technologies.js — fiches de documentation ouvertes au clic sur un "joueur"
   de la section Compétences. Chaque fiche : aperçu, concepts, forces, cas d'usage,
   exemple de code, projets liés et liens vers la documentation officielle. */
(function () {
  const DOCS = {
    react: {
      name: "React",
      tagline: "Construire l'interface à partir de composants",
      category: "Front-End · Bibliothèque UI",
      role: "Composants UI réutilisables",
      overview: "React est une bibliothèque JavaScript déclarative : on décrit l'interface en fonction de l'état, et React met à jour uniquement les parties du DOM qui changent. Les composants sont isolés, testables et composables — la base d'un design system cohérent.",
      concepts: ["Composants, props et composition", "État local avec useState / useReducer", "Effets et cycle de vie avec useEffect", "Rendu déclaratif et réconciliation"],
      strengths: ["Réutilisation forte des composants", "Écosystème et communauté immenses", "Mises à jour ciblées et prévisibles"],
      useCases: ["Interfaces riches (SPA)", "Design systems et bibliothèques", "Tableaux de bord temps réel"],
      codeLang: "JSX",
      code: `function Counter() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
      docs: [
        { label: "Documentation officielle", url: "https://react.dev/" },
        { label: "Apprendre React", url: "https://react.dev/learn" }
      ],
      projects: ["tarteel"]
    },
    next: {
      name: "Next.js",
      tagline: "Le framework React full-stack",
      category: "Front-End · Framework",
      role: "Rendu et routing full-stack",
      overview: "Next.js ajoute à React le routage par fichiers, le rendu côté serveur (SSR), la génération statique (SSG/ISR) et des routes API. On peut livrer une application complète — pages, API et déploiement — dans un seul projet.",
      concepts: ["App Router et conventions de fichiers", "Server Components et Client Components", "SSR, SSG et ISR", "Routes API et middleware"],
      strengths: ["SEO et temps de chargement optimisés", "Front et API dans le même dépôt", "Déploiement simplifié sur Vercel"],
      useCases: ["Sites vitrines et e-commerce", "Applications hybrides SSR/SPA", "Dashboards administratifs"],
      codeLang: "TSX",
      code: `export default async function Page() {
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}`,
      docs: [{ label: "Documentation Next.js", url: "https://nextjs.org/docs" }],
      projects: ["methshop", "tarteel"]
    },
    js: {
      name: "JavaScript",
      tagline: "Le langage du web moderne (ES6+)",
      category: "Front-End · Langage",
      role: "Logique ES6 côté client",
      overview: "JavaScript ES6+ apporte les modules, les classes, la destructuration, les promesses et async/await. C'est le langage commun entre le navigateur, Node.js et les outils de build.",
      concepts: ["Portées, closures et fonctions fléchées", "Promesses et async/await", "Modules ES et imports", "Tableaux : map, filter, reduce"],
      strengths: ["Unique langage front et back", "Exécution immédiate dans le navigateur", "Interopérabilité avec tout le web"],
      useCases: ["Interactions et formulaires", "Traitement de données côté client", "Scripts d'automatisation"],
      codeLang: "JavaScript",
      code: `const users = await fetch("/api/users").then(r => r.json());
const names = users.filter(u => u.active).map(u => u.name);`,
      docs: [{ label: "MDN · JavaScript", url: "https://developer.mozilla.org/fr/docs/Web/JavaScript" }],
      projects: ["taskmanager", "portfolio"]
    },
    tailwind: {
      name: "Tailwind CSS",
      tagline: "Le design system utilitaire",
      category: "Front-End · CSS",
      role: "Design system utilitaire",
      overview: "Tailwind est un framework CSS utility-first : on compose l'interface directement dans le markup avec des classes courtes. Les variantes responsive et les états (hover, dark) restent lisibles au même endroit.",
      concepts: ["Classes utilitaires et composition", "Variantes hover / focus / dark", "Breakpoints responsive", "Thème et tokens personnalisés"],
      strengths: ["Style co-localisé avec le composant", "Responsive et mode sombre natifs", "Aucun CSS mort en production"],
      useCases: ["Interfaces responsive", "Design systems", "Prototypage rapide"],
      codeLang: "HTML",
      code: `<button class="px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700">
  Tirer au panier
</button>`,
      docs: [{ label: "Documentation Tailwind", url: "https://tailwindcss.com/docs" }],
      projects: ["taskmanager", "portfolio", "methshop"]
    },
    html5: {
      name: "HTML5",
      tagline: "La structure sémantique du web",
      category: "Front-End · Langage de balisage",
      role: "Structure sémantique et accessibilité",
      overview: "HTML5 structure le contenu avec des balises porteuses de sens (header, main, article, nav). Une sémantique correcte améliore l'accessibilité, le référencement et la maintenabilité.",
      concepts: ["Balises sémantiques", "Attributs ARIA et accessibilité", "Formulaires et validation native", "Métadonnées et performa",
        "Métadonnées, images et media"],
      strengths: ["Base universelle du navigateur", "Accessibilité améliorée", "Meilleur référencement"],
      useCases: ["Pages web et documents", "Formulaires", "Contenus multimédias"],
      codeLang: "HTML",
      code: `<main>
  <article aria-labelledby="titre">
    <h1 id="titre">Mon projet</h1>
    <p>Contenu principal.</p>
  </article>
</main>`,
      docs: [{ label: "MDN · HTML", url: "https://developer.mozilla.org/fr/docs/Web/HTML" }],
      projects: ["portfolio"]
    },
    css3: {
      name: "CSS3",
      tagline: "Mise en page, responsive et animations",
      category: "Front-End · Style",
      role: "Mise en page et styles",
      overview: "CSS3 contrôle la présentation : flexbox et grid pour la mise en page, media queries pour le responsive, transitions et animations pour les micro-interactions, variables pour la cohérence du thème.",
      concepts: ["Flexbox et CSS Grid", "Media queries et containers", "Variables CSS et thèmes", "Transitions et animations"],
      strengths: ["Mise en page robuste sur tous les écrans", "Thème clair/sombre via variables", "Animations sans JavaScript"],
      useCases: ["Layouts responsive", "Design system et thèmes", "Micro-interactions"],
      codeLang: "CSS",
      code: `.card {
  display: grid;
  gap: 1rem;
  border-radius: 1rem;
  background: rgba(255,255,255,.9);
}
@media (max-width: 640px) {
  .card { grid-template-columns: 1fr; }
}`,
      docs: [{ label: "MDN · CSS", url: "https://developer.mozilla.org/fr/docs/Web/CSS" }],
      projects: ["portfolio"]
    },
    vite: {
      name: "Vite",
      tagline: "Build moderne et serveur de dev instantané",
      category: "Front-End · Outil de build",
      role: "Build et hot module replacement",
      overview: "Vite sert les modules ES nativement pendant le développement (HMR quasi instantané), puis produit un bundle optimisé avec Rollup. Sa configuration est courte et l'écosystème de plugins est vaste.",
      concepts: ["Serveur de dev et HMR", "Modules ES natifs", "Build Rollup et code splitting", "Plugins et variables d'environnement"],
      strengths: ["Démarrage très rapide", "Configuration minimale", "Sortie optimisée pour la production"],
      useCases: ["Applications React/Vue", "Bibliothèques", "Sites statiques"],
      codeLang: "JavaScript",
      code: `import { defineConfig } from "vite";

export default defineConfig({
  build: { target: "es2020", outDir: "dist" },
});`,
      docs: [{ label: "Guide Vite", url: "https://vite.dev/guide/" }]
    },
    expo: {
      name: "Expo",
      tagline: "React Native sans friction native",
      category: "Front-End · Mobile",
      role: "Applications mobiles iOS & Android",
      overview: "Expo est une plateforme et un SDK autour de React Native. Elle fournit l'application Expo Go, la CLI, les builds cloud (EAS) et de nombreux modules natifs prêts à l'emploi.",
      concepts: ["SDK et modules natifs", "Expo Go et développement rapide", "EAS Build / Update", "Navigation et assets"],
      strengths: ["Un seul code pour iOS et Android", "Pas de configuration native lourde", "Mises à jour over-the-air"],
      useCases: ["Applications mobiles", "MVP rapides", "Apps avec modules camera/audio"],
      codeLang: "TSX",
      code: `import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
  return <View><Text>Tarteel</Text><StatusBar style="light" /></View>;
}`,
      docs: [{ label: "Documentation Expo", url: "https://docs.expo.dev/" }],
      projects: ["tarteel"]
    },
    figma: {
      name: "Figma",
      tagline: "Design collaboratif et design system",
      category: "Front-End · Design",
      role: "Maquettes et design system",
      overview: "Figma centralise maquettes, prototypes et design tokens dans un espace collaboratif. Pour un développeur, l'inspecteur donne les mesures, couleurs et styles à traduire en composants.",
      concepts: ["Frames, composants et variants", "Auto layout", "Design tokens et styles", "Prototypes et mode inspecteur"],
      strengths: ["Collaboration en temps réel", "Design system partagé", "Handoff développeur précis"],
      useCases: ["Maquettes d'écrans", "Design systems", "Revues UX et prototypes"],
      codeLang: "CSS",
      code: `:root {
  --color-primary: #ff6a13;
  --radius-card: 20px;
}
.card {
  border-radius: var(--radius-card);
  background: var(--color-primary);
}`,
      docs: [{ label: "Aide Figma", url: "https://help.figma.com/hc/en-us" }]
    },
    nest: {
      name: "NestJS",
      tagline: "API Node.js structurée et typée",
      category: "Back-End · Framework",
      role: "Architecture modulaire",
      overview: "NestJS est un framework Node.js en TypeScript, organisé en modules, contrôleurs et providers. L'injection de dépendances et les décorateurs rendent les applications testables et évolutives.",
      concepts: ["Modules, contrôleurs et services", "Injection de dépendances", "Décorateurs et guards", "Pipes, interceptors et filtres"],
      strengths: ["Architecture claire dès le départ", "Typage strict et testabilité", "Écosystème (JWT, Swagger, ORM)"],
      useCases: ["API REST sécurisées", "Microservices", "Applications d'entreprise"],
      codeLang: "TypeScript",
      code: `@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  findAll() {
    return this.users.findAll();
  }
}`,
      docs: [{ label: "Documentation NestJS", url: "https://docs.nestjs.com/" }],
      projects: ["api"]
    },
    node: {
      name: "Node.js",
      tagline: "JavaScript côté serveur",
      category: "Back-End · Runtime",
      role: "Runtime serveur",
      overview: "Node.js exécute JavaScript hors du navigateur grâce à V8 et à une boucle d'événements non bloquante. Il est particulièrement adapté aux API I/O-bound et aux services temps réel.",
      concepts: ["Boucle d'événements et async", "Modules natifs (fs, http, crypto)", "npm et gestion des dépendances", "Processus et variables d'environnement"],
      strengths: ["Même langage front et back", "Concurrence efficace sur les I/O", "Écosystème npm immense"],
      useCases: ["API REST et GraphQL", "WebSockets", "Scripts et outils CLI"],
      codeLang: "JavaScript",
      code: `import http from "node:http";

http.createServer((req, res) => {
  res.end("OK");
}).listen(3000);`,
      docs: [{ label: "Documentation Node.js", url: "https://nodejs.org/docs/latest/api/" }],
      projects: ["api", "tarteel"]
    },
    ts: {
      name: "TypeScript",
      tagline: "JavaScript typé, de bout en bout",
      category: "Back-End · Langage",
      role: "Typage strict de bout en bout",
      overview: "TypeScript ajoute un système de types statiques à JavaScript. Les erreurs sont détectées avant l'exécution, les contrats de données sont explicites et l'auto-complétion devient fiable.",
      concepts: ["Types, interfaces et unions", "Génériques et inférence", "Narrowing et guards", "Types utilitaires (Pick, Omit, Partial)"],
      strengths: ["Détection précoce des erreurs", "Documentation vivante des contrats", "Refactoring sûr"],
      useCases: ["API typées", "Grands projets front", "Bibliothèques partagées"],
      codeLang: "TypeScript",
      code: `type User = { id: string; email: string; role: "admin" | "user" };

function greet(user: User): string {
  return "Bonjour " + user.email;
}`,
      docs: [{ label: "Documentation TypeScript", url: "https://www.typescriptlang.org/docs/" }],
      projects: ["api", "tarteel"]
    },
    typeorm: {
      name: "TypeORM",
      tagline: "ORM typé et migrations",
      category: "Back-End · ORM",
      role: "ORM typé et migrations",
      overview: "TypeORM mappe des classes TypeScript vers des tables SQL. Il gère les relations, les requêtes typées et les migrations, avec PostgreSQL, MySQL, SQLite et d'autres moteurs.",
      concepts: ["Entités et colonnes", "Relations OneToMany / ManyToOne", "Repositories et QueryBuilder", "Migrations de schéma"],
      strengths: ["Modèle de données typé", "Relations expresses", "Migrations versionnées"],
      useCases: ["Modélisation relationnelle", "CRUD typé", "Évolution de schéma"],
      codeLang: "TypeScript",
      code: `@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column({ unique: true }) email: string;
}`,
      docs: [{ label: "Documentation TypeORM", url: "https://typeorm.io/" }],
      projects: ["api"]
    },
    jwt: {
      name: "JWT",
      tagline: "Authentification stateless par token",
      category: "Back-End · Sécurité",
      role: "Authentification par rôles",
      overview: "JSON Web Token transporte des claims signés entre le client et le serveur. Le serveur vérifie la signature et l'expiration à chaque requête, sans conserver de session côté mémoire.",
      concepts: ["Header / payload / signature", "Expiration et refresh token", "Claims et rôles", "Vérification côté serveur"],
      strengths: ["Stateless et scalable", "Standard interopérable", "Rôles transportés dans le token"],
      useCases: ["Login API", "Accès par rôles", "Microservices"],
      codeLang: "JavaScript",
      code: `const token = jwt.sign(
  { sub: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
const payload = jwt.verify(token, process.env.JWT_SECRET);`,
      docs: [{ label: "Introduction JWT", url: "https://jwt.io/introduction" }],
      projects: ["api", "methshop"]
    },
    express: {
      name: "Express",
      tagline: "Le routage HTTP minimaliste",
      category: "Back-End · Framework",
      role: "Routage HTTP",
      overview: "Express est un framework minimal pour Node.js : il fournit le routage, les middlewares et la gestion des requêtes/réponsesHTTP. Sa souplesse en fait une base courante pour les API.",
      concepts: ["Routes et paramètres", "Middlewares", "Gestion d'erreurs", "Montage de routers"],
      strengths: ["Très léger", "Middlewares composables", "Grande compatibilité"],
      useCases: ["API REST", "Serveurs HTTP simples", "Couche entre services"],
      codeLang: "JavaScript",
      code: `app.get("/users/:id", async (req, res) => {
  const user = await Users.findById(req.params.id);
  res.json(user ?? null);
});`,
      docs: [{ label: "Documentation Express", url: "https://expressjs.com/fr/" }],
      projects: ["api"]
    },
    fastify: {
      name: "Fastify",
      tagline: "API Node.js haute performance",
      category: "Back-End · Framework",
      role: "API haute performance",
      overview: "Fastify est un framework HTTP orienté performance et validation. Il valide les entrées avec JSON Schema, propose une architecture à plugins et un logging intégré.",
      concepts: ["Routes et schémas JSON", "Plugins et encapsulation", "Hooks de cycle de vie", "Sérialisation rapide"],
      strengths: ["Débit élevé", "Validation native des entrées", "Logging structuré"],
      useCases: ["API à fort trafic", "Services légers", "Gateways"],
      codeLang: "JavaScript",
      code: `fastify.get("/ping", async () => ({ pong: true }));
await fastify.listen({ port: 3000 });`,
      docs: [{ label: "Documentation Fastify", url: "https://fastify.dev/docs/latest/" }]
    },
    bcrypt: {
      name: "Bcrypt",
      tagline: "Hashing des mots de passe",
      category: "Back-End · Sécurité",
      role: "Hash des mots de passe",
      overview: "Bcrypt dérive une empreinte salée et coûteuse d'un mot de passe. On ne stocke jamais le mot de passe en clair : on compare l'entrée avec le hash enregistré.",
      concepts: ["Salt intégré", "Facteur de coût (rounds)", "Comparaison en temps constant", "Jamais de stockage en clair"],
      strengths: ["Résistant aux attaques par force brute", "Salt automatique", "Coût ajustable"],
      useCases: ["Inscription et connexion", "Réinitialisation", "Stockage sécurisé de secrets"],
      codeLang: "JavaScript",
      code: `const hash = await bcrypt.hash(password, 12);
const ok = await bcrypt.compare(password, hash);`,
      docs: [{ label: "node.bcrypt.js sur GitHub", url: "https://github.com/kelektiv/node.bcrypt.js#readme" }],
      projects: ["api"]
    },
    socket: {
      name: "Socket.IO",
      tagline: "Temps réel bidirectionnel",
      category: "Back-End · Temps réel",
      role: "Communication temps réel",
      overview: "Socket.IO établit une connexion bidirectionnelle entre le navigateur et le serveur, avec reconnexion automatique, rooms et fallback. Idéal pour synchroniser des états entre appareils.",
      concepts: ["Connexions et événements", "Rooms et namespaces", "Reconnexion automatique", "Broadcast et acknowledgements"],
      strengths: ["Temps réel simple à mettre en œuvre", "Reconnexion robuste", "Communication par événements"],
      useCases: ["Chat et notifications", "Synchronisation de tâches", "Tableaux de bord live"],
      codeLang: "JavaScript",
      code: `io.on("connection", (socket) => {
  socket.on("task:update", (task) => {
    io.emit("task:updated", task);
  });
});`,
      docs: [{ label: "Documentation Socket.IO", url: "https://socket.io/docs/v4/" }]
    },
    postgresql: {
      name: "PostgreSQL",
      tagline: "Base relationnelle robuste",
      category: "Back-End · Base de données",
      role: "Base relationnelle et SQL",
      overview: "PostgreSQL est un SGBD relationnel open source reconnu pour sa fiabilité, ses contraintes, ses jointures et ses types avancés (JSONB, UUID, arrays).",
      concepts: ["Tables, clés et contraintes", "Jointures et agrégations", "Index et plans d'exécution", "Transactions ACID"],
      strengths: ["Intégrité des données", "Requêtes analytiques puissantes", "Extensible (JSONB, extensions)"],
      useCases: ["Données structurées", "Comptes et permissions", "Rapports et analytics"],
      codeLang: "SQL",
      code: `SELECT u.id, COUNT(t.id) AS tasks
FROM users u
LEFT JOIN tasks t ON t.user_id = u.id
GROUP BY u.id
ORDER BY tasks DESC;`,
      docs: [{ label: "Documentation PostgreSQL", url: "https://www.postgresql.org/docs/current/" }],
      projects: ["tarteel"]
    },
    redis: {
      name: "Redis",
      tagline: "Cache et stockage clé/valeur",
      category: "Back-End · Cache",
      role: "Cache et sessions",
      overview: "Redis stocke des données en mémoire sous forme de clé/valeur avec des structures riches (listes, sets, hashes). Il sert de cache, de file d'attente ou de store de sessions.",
      concepts: ["Clés et expiration TTL", "Strings, hashes, lists, sets", "Pub/Sub", "Persistance optionnelle"],
      strengths: ["Latence très faible", "Structures de données variées", "Découplage des services"],
      useCases: ["Cache de requêtes", "Sessions utilisateur", "Files et compteurs"],
      codeLang: "JavaScript",
      code: `await redis.set("session:" + userId, JSON.stringify(data), { EX: 3600 });
const cached = await redis.get("session:" + userId);`,
      docs: [{ label: "Documentation Redis", url: "https://redis.io/docs/latest/" }]
    },
    jest: {
      name: "Jest",
      tagline: "Tests unitaires et d'intégration",
      category: "Back-End · Qualité",
      role: "Tests et fiabilité",
      overview: "Jest est un runner de tests JavaScript avec assertions, mocks et couverture de code intégrés. Il sécurise les refactoring et documente le comportement attendu des fonctions.",
      concepts: ["describe / it / expect", "Mocks et spies", "Fixtures et setup", "Couverture de code"],
      strengths: ["Configuration minimale", "Mocks puissants", "Rapport de couverture clair"],
      useCases: ["Tests unitaires", "Tests de services", "Vérification des régressions"],
      codeLang: "JavaScript",
      code: `describe("add", () => {
  it("additionne deux nombres", () => {
    expect(add(2, 3)).toBe(5);
  });
});`,
      docs: [{ label: "Documentation Jest", url: "https://jestjs.io/docs/getting-started" }]
    },
    graphql: {
      name: "GraphQL",
      tagline: "API typée, le client choisit ses données",
      category: "Back-End · API",
      role: "API typée et flexible",
      overview: "GraphQL expose un schéma typé : le client demande exactement les champs dont il a besoin, en une seule requête. Cela réduit le sur-fetching et facilite l'évolution de l'API.",
      concepts: ["Schéma, types et resolvers", "Queries, mutations et subscriptions", "Fragments et variables", "Introspection et documentation"],
      strengths: ["Contrat typé explicite", "Une seule requête pour plusieurs ressources", "Évolution sans casser les clients"],
      useCases: ["API multi-clients", "Applications mobiles", "Données imbriquées"],
      codeLang: "GraphQL",
      code: `type Query {
  user(id: ID!): User
}

type User {
  id: ID!
  email: String!
}`,
      docs: [{ label: "Apprendre GraphQL", url: "https://graphql.org/learn/" }]
    },
    mongodb: {
      name: "MongoDB",
      tagline: "Base de données documentaire",
      category: "Données & Outils · Base NoSQL",
      role: "Base de données NoSQL",
      overview: "MongoDB stocke des documents BSON dans des collections. Le schéma flexible permet de faire évoluer rapidement les modèles, tout en gardant indexation, agrégations et transactions.",
      concepts: ["Documents et collections", "BSON et ObjectId", "Index et pipeline d'agrégation", "Relations par référence ou embedding"],
      strengths: ["Schéma évolutif", "Agrégations puissantes", "Intégration naturelle avec Node.js"],
      useCases: ["Catalogues produits", "Données semi-structurées", "Prototypage rapide"],
      codeLang: "JavaScript",
      code: `const users = await db.collection("users")
  .find({ active: true })
  .project({ email: 1 })
  .toArray();`,
      docs: [{ label: "Documentation MongoDB", url: "https://www.mongodb.com/docs/" }],
      projects: ["api", "methshop"]
    },
    firebase: {
      name: "Firebase",
      tagline: "Backend as a service",
      category: "Données & Outils · Plateforme",
      role: "Auth et temps réel",
      overview: "Firebase fournit authentification, base de données temps réel ou Firestore, stockage, functions et analytics. Il accélère le passage du prototype à la production sans serveur à gérer.",
      concepts: ["Authentication et providers", "Firestore et Realtime Database", "Cloud Functions", "Rules de sécurité"],
      strengths: ["Intégration mobile et web rapide", "Temps réel natif", "Infrastructure managée"],
      useCases: ["Auth par email ou OAuth", "Synchronisation multi-appareils", "MVP et applications mobiles"],
      codeLang: "JavaScript",
      code: `const auth = getAuth();
const user = await signInWithEmailAndPassword(auth, email, password);`,
      docs: [{ label: "Documentation Firebase", url: "https://firebase.google.com/docs" }],
      projects: ["taskmanager", "tarteel"]
    },
    swagger: {
      name: "Swagger / OpenAPI",
      tagline: "API documentation pour les humains et les machines",
      category: "Données & Outils · Documentation",
      role: "Documentation d'API",
      overview: "OpenAPI décrit les routes, paramètres, schémas et réponses d'une API dans un fichier standard. Swagger UI transforme cette spec en documentation interactive, directement testable.",
      concepts: ["Fichier OpenAPI (YAML/JSON)", "Schémas et composants réutilisables", "Sécurité (bearer, API key)", "Swagger UI et génération de clients"],
      strengths: ["Contrat partagé front/back", "Documentation toujours à jour", "Test des routes depuis le navigateur"],
      useCases: ["Documentation d'API REST", "Onboarding d'équipe", "Génération de clients HTTP"],
      codeLang: "YAML",
      code: `openapi: 3.0.3
info:
  title: API Secure
  version: 1.0.0
paths:
  /users:
    get:
      responses:
        "200":
          description: OK`,
      docs: [{ label: "Documentation Swagger", url: "https://swagger.io/docs/" }],
      projects: ["api"]
    },
    git: {
      name: "Git",
      tagline: "Versionnement distribué",
      category: "Données & Outils · Versionnement",
      role: "Versionnement structuré",
      overview: "Git enregistre l'historique complet d'un projet sous forme de commits. Les branches permettent de travailler en parallèle, les merges et les PR de intégrer les changements de façon tracée.",
      concepts: ["Commits et snapshot", "Branches et merges", "Rebase et résolution de conflits", "Remote, fetch et push"],
      strengths: ["Historique complet et reversible", "Travail en parallèle", "Traçabilité des changements"],
      useCases: ["Développement en équipe", "Releases et tags", "Expérimentation sur branches"],
      codeLang: "Bash",
      code: `git switch -c feat/auth
git add .
git commit -m "feat: ajoute l'authentification"
git push -u origin feat/auth`,
      docs: [{ label: "Documentation Git", url: "https://git-scm.com/doc" }]
    },
    github: {
      name: "GitHub",
      tagline: "Collaboration autour du code",
      category: "Données & Outils · Collaboration",
      role: "Collaboration et pull requests",
      overview: "GitHub héberge les dépôts Git et ajoute les issues, les pull requests, les revues de code et les Actions. C'est le point de coordination entre développement, revue et déploiement.",
      concepts: ["Pull requests et revues", "Issues et projets", "Protections de branches", "GitHub Actions et releases"],
      strengths: ["Revue de code structurée", "Traçabilité des décisions", "Intégration CI/CD"],
      useCases: ["Travail en équipe", "Open source", "Automatisation des vérifications"],
      codeLang: "Bash",
      code: `gh issue create --title "Bug sur le panier"
gh pr create --fill --base main`,
      docs: [{ label: "Documentation GitHub", url: "https://docs.github.com/" }]
    },
    stripe: {
      name: "Stripe",
      tagline: "Paiements sécurisés",
      category: "Données & Outils · Paiement",
      role: "Paiements sécurisés",
      overview: "Stripe fournit des API de paiement, Checkout, abonnements et webhooks. Les données de carte ne transitent jamais par votre serveur : Stripe gère la conformité PCI.",
      concepts: ["Checkout Sessions", "Payment Intents", "Webhooks et signature", "Mode test et production"],
      strengths: ["Sécurité PCI déléguée", "Intégration simple", "Webhooks fiables"],
      useCases: ["Boutique en ligne", "Abonnements", "Paiements récurrents"],
      codeLang: "JavaScript",
      code: `const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: "https://exemple.fr/success",
});`,
      docs: [{ label: "Documentation Stripe", url: "https://docs.stripe.com/" }],
      projects: ["methshop"]
    },
    vercel: {
      name: "Vercel",
      tagline: "Déploiement front en quelques secondes",
      category: "Données & Outils · Déploiement",
      role: "Déploiement du front",
      overview: "Vercel déploie les applications front à chaque push, avec previews par branche, CDN global et intégration poussée avec Next.js.",
      concepts: ["Déploiements par commit", "Preview deployments", "Edge/CDN et cache", "Variables d'environnement"],
      strengths: ["Déploiement instantané", "URL de preview par PR", "Performance CDN mondiale"],
      useCases: ["Sites statiques et Next.js", "Previews de revue", "Applications front production"],
      codeLang: "JSON",
      code: `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}`,
      docs: [{ label: "Documentation Vercel", url: "https://vercel.com/docs" }],
      projects: ["portfolio", "methshop"]
    },
    render: {
      name: "Render",
      tagline: "Hébergement d'API et de services",
      category: "Données & Outils · Déploiement",
      role: "Déploiement de l'API",
      overview: "Render héberge des services web, des workers, des bases et des sites statiques. Il construit l'application à partir du dépôt et gère les redéploiements et les variables d'environnement.",
      concepts: ["Web services et background workers", "Build et start commands", "Health checks", "Bases managées et disques"],
      strengths: ["Configuration simple", "Déploiement depuis Git", "Services complémentaires intégrés"],
      useCases: ["API Node.js", "Services backend", "Environnements de staging"],
      codeLang: "YAML",
      code: `services:
  - type: web
    name: api-secure
    runtime: node
    buildCommand: npm run build
    startCommand: npm start`,
      docs: [{ label: "Documentation Render", url: "https://render.com/docs" }],
      projects: ["api"]
    },
    docker: {
      name: "Docker",
      tagline: "Environnements reproductibles",
      category: "Données & Outils · Conteneurs",
      role: "Conteneurs et environnements",
      overview: "Docker empaquette une application et ses dépendances dans une image exécutable de façon identique partout. Il élimine les différences entre développement, test et production.",
      concepts: ["Images et conteneurs", "Dockerfile et couches", "Volumes et réseaux", "Docker Compose"],
      strengths: ["Reproductibilité", "Isolation des services", "Démarrage rapide"],
      useCases: ["Environnements de dev", "Déploiement d'API", "Multi-services avec Compose"],
      codeLang: "Dockerfile",
      code: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "start"]`,
      docs: [{ label: "Documentation Docker", url: "https://docs.docker.com/" }]
    },
    githubactions: {
      name: "GitHub Actions",
      tagline: "CI/CD directement dans le dépôt",
      category: "Données & Outils · Automatisation",
      role: "CI/CD et déploiement automatisé",
      overview: "GitHub Actions exécute des workflows sur événements (push, PR, release) : installation, tests, lint, build et déploiement. Les secrets restent côté dépôt.",
      concepts: ["Workflows, jobs et steps", "Triggers on: push / pull_request", "Actions réutilisables", "Secrets et environnements"],
      strengths: ["Intégré à GitHub", "Matrice de versions", "Déploiement automatisé"],
      useCases: ["Lancer les tests à chaque PR", "Build et déploiement", "Vérifications de quality gate"],
      codeLang: "YAML",
      code: `name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test`,
      docs: [{ label: "Documentation GitHub Actions", url: "https://docs.github.com/actions" }]
    },
    linux: {
      name: "Linux",
      tagline: "Serveurs, shell et permissions",
      category: "Données & Outils · Système",
      role: "Serveurs et ligne de commande",
      overview: "Linux est le système d'exécution de la plupart des serveurs web. Connaître le shell, les permissions, les processus et systemd permet de déployer, diagnostiquer et sécuriser une application.",
      concepts: ["Shell et navigation", "Permissions utilisateurs/fichiers", "Processus et systemd", "Réseau et logs"],
      strengths: ["Stabilité et contrôle", "Outils d'administration puissants", "Écosystème serveur dominant"],
      useCases: ["Administration de serveurs", "Déploiement manuel", "Diagnostic de production"],
      codeLang: "Bash",
      code: `# navigation et permissions
cd /var/www && ls -la
chmod 644 config.json
systemctl status nginx`,
      docs: [{ label: "Manuel Bash (GNU)", url: "https://www.gnu.org/software/bash/manual/bash.html" }]
    }
  };

  const TEAM_LABEL = { white: "Front-End", navy: "Back-End", orange: "Données & Outils" };
  const TEAM_LEVEL = { white: 85, navy: 90, orange: 80 };
  const PROJECT_LABEL = {
    taskmanager: "Task-manager",
    portfolio: "Portfolio Pro",
    api: "API Secure & Scalable",
    methshop: "Meth-Shop",
    tarteel: "Tarteel"
  };

  const modal = document.getElementById("tech-modal");
  if (!modal) return;
  const $ = (id) => document.getElementById(id);
  let lastFocused = null;

  function fillList(el, items) {
    el.replaceChildren();
    (items || []).forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      el.appendChild(li);
    });
  }

  function fillLinks(el, links) {
    el.replaceChildren();
    (links || []).forEach((item, i) => {
      const a = document.createElement("a");
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = item.label + " ↗";
      a.className = i === 0
        ? "inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 bg-hoop text-white font-bold text-sm rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        : "inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm rounded-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300";
      el.appendChild(a);
    });
  }

  function fillProjects(el, wrap, ids) {
    wrap.classList.toggle("hidden", !ids || !ids.length);
    el.replaceChildren();
    (ids || []).forEach((id) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = (PROJECT_LABEL[id] || id) + " →";
      btn.className = "px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs hover:border-hoop transition-colors";
      btn.addEventListener("click", () => {
        closeTechModal();
        const card = document.querySelector('.project-card[data-project="' + id + '"]');
        if (card) card.click();
      });
      el.appendChild(btn);
    });
  }

  function render(card) {
    const iconEl = card.querySelector("[data-ico]");
    const key = iconEl && iconEl.dataset.ico;
    const doc = DOCS[key];
    if (!doc) return false;

    const panel = card.closest(".team-panel");
    const edition = panel ? panel.dataset.edition : "white";
    const badge = $("tech-icon-badge");
    const icon = iconEl && iconEl.querySelector(".ico");
    badge.replaceChildren();
    if (icon) {
      const clone = icon.cloneNode(true);
      clone.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });
      badge.appendChild(clone);
    } else {
      const fb = document.createElement("span");
      fb.className = "ico-fb";
      fb.textContent = key.slice(0, 2).toUpperCase();
      badge.appendChild(fb);
    }

    $("tech-hero-category").textContent = doc.category;
    $("tech-modal-title").textContent = doc.name;
    $("tech-hero-tagline").textContent = doc.tagline;
    $("tech-hero-num").textContent = "#" + (card.dataset.num || "—") + " · " + (TEAM_LABEL[edition] || "Équipe");
    $("tech-hero-level").textContent = "MAÎTRISE " + (TEAM_LEVEL[edition] || "—") + "%";
    $("tech-overview").textContent = doc.overview;
    $("tech-role").textContent = doc.role;
    $("tech-team").textContent = TEAM_LABEL[edition] || "—";
    fillList($("tech-concepts"), doc.concepts);
    fillList($("tech-strengths"), doc.strengths);
    fillList($("tech-use-cases"), doc.useCases);
    $("tech-code-lang").textContent = doc.codeLang || "Exemple";
    $("tech-code").textContent = doc.code || "";
    fillProjects($("tech-projects"), $("tech-projects-wrap"), doc.projects);
    fillLinks($("tech-links"), doc.docs);
    return true;
  }

  function openTechModal(card) {
    if (!render(card)) return;
    lastFocused = document.activeElement;
    modal.classList.add("open");
    document.body.classList.add("overflow-hidden");
    modal.querySelector(".modal-panel").scrollTop = 0;
    $("tech-modal-close").focus();
  }

  function closeTechModal() {
    modal.classList.remove("open");
    const projectModal = document.getElementById("project-modal");
    if (!projectModal || !projectModal.classList.contains("open")) {
      document.body.classList.remove("overflow-hidden");
    }
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  document.documentElement.classList.add("js-tech");
  document.querySelectorAll("#competences .player, #competences .bench-card").forEach((card) => {
    const iconEl = card.querySelector("[data-ico]");
    const label = iconEl ? iconEl.textContent.trim() : "cette technologie";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Voir la documentation de " + label);
    card.addEventListener("click", () => openTechModal(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openTechModal(card);
      }
    });
  });

  $("tech-modal-close").addEventListener("click", closeTechModal);
  $("tech-backdrop").addEventListener("click", closeTechModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeTechModal();
  });
})();

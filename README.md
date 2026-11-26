# Portfolio — Mohamed Abdalah Fall

Site statique (HTML / Tailwind CDN / JavaScript) avec une fonction serverless Vercel pour l'envoi du formulaire de contact.

## Lancer en local

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

Le formulaire appelle `/api/contact` : en local avec `http.server`, cette route n'existe pas. Pour tester l'envoi, utilisez le site déployé ou `vercel dev` (CLI Vercel) avec la variable d'environnement définie.

## Configurer l'envoi des messages (Resend)

1. Créer un compte sur [resend.com](https://resend.com) avec `abdalahfall862@gmail.com`.
2. Dans le dashboard Resend : **API Keys → Create API key**, puis copier la clé (`re_...`).
3. Dans Vercel : **Projet → Settings → Environment Variables**, ajouter :
   - `RESEND_API_KEY` = la clé copiée
4. Redéployer (un `git push` sur `main` déclenche le déploiement automatique).

Les messages arrivent alors dans la boîte Gmail du propriétaire du compte Resend, avec le champ « Répondre » pointant vers l'email du visiteur. La clé API reste côté serveur : elle n'est jamais exposée dans le navigateur.

> Le domaine d'envoi par défaut de Resend (`onboarding@resend.dev`) permet d'envoyer uniquement à l'adresse du propriétaire du compte — c'est précisément le cas ici. Pour envoyer à d'autres destinataires, il faut vérifier un domaine dans Resend.

## Structure

- `index.html` — pages et sections (effectif en 3 équipes, modale projets, formulaire)
- `script.js` — données projets, cartes, modale, formulaire
- `equipe.css`, `equipe.js` — onglets d'équipes et présentation des joueurs
- `technologies.js` — fiches de documentation ouvertes au clic sur chaque technologie
- `hoop.js` — demi-cercle/filet avant du panier, au-dessus du canvas 3D
- `court.js`, `hightech.js`, `three-scene.js` — effets (icônes, HUD, balle 3D)
- `api/contact.js` — fonction Vercel : validation + envoi via Resend
- `.env.example` — modèle de variable d'environnement

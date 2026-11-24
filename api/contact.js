/* api/contact.js — envoi du formulaire de contact via Resend.
   Déployé automatiquement comme fonction serverless par Vercel.
   Variables d'environnement requises : RESEND_API_KEY. */

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, message: 'Méthode non autorisée' });
    }

    const body = typeof req.body === 'string'
        ? Object.fromEntries(new URLSearchParams(req.body))
        : (req.body || {});

    const name = String(body.name || '').trim().slice(0, 120);
    const email = String(body.email || '').trim().slice(0, 200);
    const message = String(body.message || '').trim().slice(0, 5000);
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    if (!name || !emailOk || !message) {
        return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs avec une adresse email valide.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ success: false, message: 'Clé API manquante (RESEND_API_KEY).' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // Le domaine par défaut de Resend permet d'envoyer à l'adresse du propriétaire du compte.
                from: 'Portfolio <onboarding@resend.dev>',
                to: ['abdalahfall862@gmail.com'],
                reply_to: email,
                subject: `Message portfolio — ${name}`,
                text: `${message}\n\n— ${name}\n${email}`
            })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            return res.status(502).json({ success: false, message: data.message || 'Erreur lors de l’envoi.' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Erreur réseau lors de l’envoi.' });
    }
};

module.exports.config = { runtime: 'nodejs20.x' };

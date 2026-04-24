import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-portfolio-6f2b6.firebaseapp.com",
  projectId: "my-portfolio-6f2b6",
  storageBucket: "my-portfolio-6f2b6.firebasestorage.app",
  messagingSenderId: "795983404958",
  appId: "1:795983404958:web:d59e128e586770db9d008f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menu-btn");
    const links = document.querySelectorAll(".sidebar-link");
    const contactForm = document.getElementById("contact-form");

    // SIDEBAR
    if (sidebar && menuBtn) {
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("-translate-x-full");
        });

        links.forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth < 1024) {
                    sidebar.classList.add("-translate-x-full");
                }
            });
        });
    }

    // REVEAL
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(el =>
        revealObserver.observe(el)
    );

    // FORMULAIRE
    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector("button");
            if (!btn || btn.disabled) return;

            const originalText = btn.innerText;

            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();

            if (!name || !email || !message) {
                btn.innerText = "Champs obligatoires";
                setTimeout(() => (btn.innerText = originalText), 2000);
                return;
            }

            btn.innerText = "ENVOI...";
            btn.disabled = true;

            try {
                await addDoc(collection(db, "messages"), {
                    name,
                    email,
                    message,
                    createdAt: new Date()
                });

                btn.innerText = "Envoyé";
                contactForm.reset();

            } catch (error) {
                console.error(error);
                btn.innerText = "❌ Erreur";
            }

            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            }, 2000);
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menu-btn");

    console.log("sidebar:", sidebar);
    console.log("menuBtn:", menuBtn);

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

            btn.innerText = "ENVOI EN COURS...";
            btn.disabled = true;
            btn.classList.add("opacity-50");

            try {
                await addDoc(collection(db, "messages"), {
                    name,
                    email,
                    message,
                    createdAt: new Date()
                });

                btn.innerText = " MESSAGE ENVOYÉ";
                contactForm.reset();

            } catch (error) {
                console.error(error);
                btn.innerText = "ERREUR";
            }

            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.classList.remove("opacity-50");
            }, 2000);
        });
    }
});
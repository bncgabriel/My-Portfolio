document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = anchor.getAttribute("href");
            const targetElement = targetId ? document.querySelector(targetId) : null;
            if (targetElement) {
                if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
                    mobileMenu.classList.add("hidden");
                }
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth",
                });
                document.querySelectorAll(".nav-link").forEach((link) => {
                    link.classList.remove("active");
                    link.classList.add("text-gray-600");
                    link.classList.remove("text-gray-800");
                });
                anchor.classList.add("active");
                anchor.classList.remove("text-gray-600");
                anchor.classList.add("text-gray-800");
            }
        });
    });

    window.addEventListener("scroll", () => {
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-link");
        let currentSection = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });
        navLinks.forEach((link) => {
            link.classList.remove("active");
            link.classList.add("text-gray-600");
            link.classList.remove("text-gray-800");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
                link.classList.remove("text-gray-600");
                link.classList.add("text-gray-800");
            }
        });
    });

    const modal = document.getElementById("doc-modal");
    const modalContent = document.getElementById("doc-modal-content");
    const closeRight = document.getElementById("doc-close-right");
    const i18nElements = document.querySelectorAll("[data-i18n]");
    const i18nAttrElements = document.querySelectorAll("[data-i18n-attr]");
    const langToggles = document.querySelectorAll(".lang-toggle");
    const titleByLang = {
        pt: "Gabriel Benicio | Desenvolvedor Full Stack",
        en: "Gabriel Benicio | Full Stack Developer",
    };

    const applyLanguage = (lang) => {
        document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
        document.body.dataset.lang = lang;
        document.title = titleByLang[lang] || document.title;

        i18nElements.forEach((el) => {
            const value = el.dataset[lang];
            if (value !== undefined) {
                el.textContent = value;
            }
        });

        i18nAttrElements.forEach((el) => {
            const attr = el.dataset.i18nAttr;
            const value = el.dataset[`${lang}Attr`];
            if (attr && value !== undefined) {
                el.setAttribute(attr, value);
            }
        });

        langToggles.forEach((btn) => {
            const label = btn.querySelector(".lang-toggle__text");
            if (label) {
                label.textContent = lang === "pt" ? "PT" : "EN";
            }
            btn.setAttribute(
                "aria-label",
                lang === "pt" ? "Alternar idioma para inglês" : "Switch language to Portuguese"
            );
        });
    };

    const closeModal = () => {
        if (!modal || !modalContent) {
            return;
        }
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        modalContent.innerHTML = "";
        document.body.classList.remove("overflow-hidden");
    };

    const openModal = (src) => {
        if (!modal || !modalContent) {
            return;
        }
        const isPdf = src.toLowerCase().endsWith(".pdf");
        const title = document.body.dataset.lang === "en" ? "Document preview" : "Visualização do documento";
        const alt = document.body.dataset.lang === "en" ? "Document preview" : "Visualização do documento";

        modalContent.innerHTML = isPdf
            ? `<iframe src="${src}" class="h-full w-full" title="${title}"></iframe>`
            : `<img src="${src}" alt="${alt}" class="max-h-full max-w-full" />`;

        modal.classList.remove("hidden");
        modal.classList.add("flex");
        document.body.classList.add("overflow-hidden");
    };

    document.querySelectorAll(".doc-trigger").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const src = link.getAttribute("href");
            if (src) {
                openModal(src);
            }
        });
    });

    langToggles.forEach((btn) => {
        btn.addEventListener("click", () => {
            const current = document.body.dataset.lang === "en" ? "en" : "pt";
            applyLanguage(current === "pt" ? "en" : "pt");
        });
    });

    if (closeRight) {
        closeRight.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) {
            closeModal();
        }
    });

    applyLanguage("pt");
});

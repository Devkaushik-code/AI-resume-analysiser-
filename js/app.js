/* =========================================================
   RESUMEAI — MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );

            menuToggle.textContent =
                isOpen ? "✕" : "☰";
        });


        /* Close mobile menu after clicking a link */

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open menu"
                );

                menuToggle.textContent = "☰";
            });

        });

    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const yearElement =
        document.querySelector(".footer-bottom p");

    if (yearElement) {

        yearElement.textContent =
            `© ${new Date().getFullYear()} ResumeAI. Built as an AI career project.`;

    }


    console.log(
        "ResumeAI loaded successfully!"
    );

});
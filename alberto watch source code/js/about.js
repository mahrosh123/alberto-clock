document.addEventListener("DOMContentLoaded", function () {

    // NAVBAR SCROLL EFFECT

    const navbar = document.getElementById("mainNavbar");

    function updateNavbar() {
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 40);
        }
    }

    window.addEventListener("scroll", updateNavbar, { passive: true });

    updateNavbar();


    // LIVE DATE AND TIME

    const dateTime = document.getElementById("dateTime");

    function updateClock() {

        if (!dateTime) return;

        const now = new Date();

        const date = now.toLocaleDateString("en-PK", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const time = now.toLocaleTimeString("en-PK", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        dateTime.textContent = date + "  |  " + time;
    }

    updateClock();

    setInterval(updateClock, 1000);


    // AUTOMATIC FOOTER YEAR

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    // SCROLL REVEAL ANIMATIONS

    const animatedElements = document.querySelectorAll(
        ".story-content, .story-image-wrap, " +
        ".section-top, .values-heading, .value-card, " +
        ".craft-section .col-lg-6, .statement-content, .cta-section"
    );

    animatedElements.forEach(function (element) {
        element.classList.add("reveal");
    });

    document.body.classList.add("js-ready");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        animatedElements.forEach(function (element) {
            observer.observe(element);
        });

    } else {

        animatedElements.forEach(function (element) {
            element.classList.add("visible");
        });

    }


    // CLOSE MOBILE MENU AFTER CLICKING A LINK

    const menu = document.getElementById("menu");

    if (menu && window.bootstrap) {

        const menuLinks = menu.querySelectorAll(".nav-link");

        menuLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                if (window.innerWidth < 992 && menu.classList.contains("show")) {

                    const collapse = bootstrap.Collapse.getOrCreateInstance(menu);

                    collapse.hide();
                }

            });

        });

    }

});

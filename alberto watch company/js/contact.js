
document.addEventListener("DOMContentLoaded", function () {

    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("open");

            menuBtn.setAttribute("aria-expanded", String(isOpen));

            menuBtn.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            menuBtn.innerHTML = isOpen
                ? '<i class="bi bi-x-lg"></i>'
                : '<i class="bi bi-list"></i>';
        });

        // Close menu after clicking a link
        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("open");

                menuBtn.setAttribute("aria-expanded", "false");
                menuBtn.setAttribute("aria-label", "Open navigation");

                menuBtn.innerHTML = '<i class="bi bi-list"></i>';
            });

        });

        // Close menu on desktop screens
        window.addEventListener("resize", function () {

            if (window.innerWidth > 767) {

                navLinks.classList.remove("open");

                menuBtn.setAttribute("aria-expanded", "false");
                menuBtn.setAttribute("aria-label", "Open navigation");

                menuBtn.innerHTML = '<i class="bi bi-list"></i>';
            }

        });
    }


    // =====================================
    // 2. AUTOMATIC FOOTER YEAR
    // =====================================

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    // =====================================
    // 3. MESSAGE CHARACTER COUNTER
    // =====================================

    const message = document.getElementById("message");
    const charCount = document.getElementById("charCount");

    if (message && charCount) {

        function updateCounter() {
            charCount.textContent = message.value.length;
        }

        message.addEventListener("input", function () {

            // Remove old custom error while editing
            message.setCustomValidity("");

            updateCounter();
        });

        updateCounter();
    }


    // =====================================
    // 4. BOOTSTRAP FORM VALIDATION
    // =====================================

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    if (!contactForm) {
        return;
    }

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const consent = document.getElementById("consent");
    const submitBtn = document.getElementById("submitBtn");


    // Validate name
    if (name) {

        name.addEventListener("input", function () {
            name.setCustomValidity("");
        });

    }


    // Validate email
    if (email) {

        email.addEventListener("input", function () {
            email.setCustomValidity("");
        });

    }


    // Validate subject
    if (subject) {

        subject.addEventListener("change", function () {
            subject.setCustomValidity("");
        });

    }


    // Clear old status messages
    function clearFormMessage() {

        if (formMessage) {
            formMessage.textContent = "";
            formMessage.classList.remove("error");
        }
    }


    // =====================================
    // 5. FORM SUBMISSION
    // =====================================

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();

        clearFormMessage();

        // Trim spaces from text fields
        if (name) {
            name.value = name.value.trim();

            if (name.value.length < 2) {

                name.setCustomValidity(
                    "Please enter at least 2 characters."
                );

            } else {

                name.setCustomValidity("");
            }
        }

        if (message) {
            message.value = message.value.trim();

            if (message.value.length < 10) {

                message.setCustomValidity(
                    "Please enter at least 10 characters."
                );

            } else {

                message.setCustomValidity("");
            }

            if (charCount) {
                charCount.textContent = message.value.length;
            }
        }

        // Validate all form fields
        contactForm.classList.add("was-validated");

        if (!contactForm.checkValidity()) {

            if (formMessage) {
                formMessage.textContent =
                    "Please correct the highlighted fields.";

                formMessage.classList.add("error");
            }

            // Focus the first invalid field
            const firstInvalid =
                contactForm.querySelector(":invalid");

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;
        }


        // =====================================
        // 6. PREPARE EMAIL
        // =====================================

        const recipient = "hamzakhanaptech5@gmail.com";

        const emailSubject =
            "Alberto Website - " + subject.value;

        const emailBody =
            "Hello Alberto Watch Company,\n\n" +
            "Name: " + name.value + "\n" +
            "Email: " + email.value + "\n" +
            "Enquiry: " + subject.value + "\n\n" +
            "Message:\n" + message.value + "\n\n" +
            "Sent from the Alberto contact page.";

        const mailtoLink =
            "mailto:" + recipient +
            "?subject=" + encodeURIComponent(emailSubject) +
            "&body=" + encodeURIComponent(emailBody);


        // Tell the visitor what will happen
        if (formMessage) {

            formMessage.textContent =
                "Your details are valid. Opening your email application...";

            formMessage.classList.remove("error");
        }

        if (submitBtn) {
            submitBtn.disabled = true;
        }

        // Open the visitor's email application
        window.location.href = mailtoLink;

        // Allow retry if the email application did not open
        window.setTimeout(function () {

            if (submitBtn) {
                submitBtn.disabled = false;
            }

        }, 2500);

    });

});
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.firstElementChild.className = open ? 'bi bi-x' : 'bi bi-list';
    });
  }

  // Contact form
  const form = document.getElementById('contactForm');
  if (!form) return;

  const RECIPIENT = 'abc@gmail.com'; // change to your real email
  const message = document.getElementById('message');
  const counter = document.getElementById('charCount');
  const status = document.getElementById('formMessage');

  message.addEventListener('input', () => {
    counter.textContent = message.value.length;
  });

  // Clear error state as the user fixes a field
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    const clear = () => field.classList.toggle('is-invalid', !field.checkValidity() && field.dataset.touched === '1');
    field.addEventListener('blur', () => { field.dataset.touched = '1'; clear(); });
    field.addEventListener('input', clear);
    field.addEventListener('change', clear);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'form-message';
    status.textContent = '';

    let valid = true;
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.dataset.touched = '1';
      const ok = field.checkValidity() && (field.type === 'checkbox' || field.value.trim() !== '');
      field.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.classList.add('error');
      status.textContent = 'Please correct the highlighted fields and try again.';
      const first = form.querySelector('.is-invalid');
      if (first) first.focus();
      return;
    }

    const data = new FormData(form);
    const subject = `[${data.get('subject')}] Enquiry from ${data.get('name').trim()}`;
    const body =
      `Name: ${data.get('name').trim()}\n` +
      `Email: ${data.get('email').trim()}\n` +
      `Enquiry type: ${data.get('subject')}\n\n` +
      `${data.get('message').trim()}`;

    window.location.href =
      `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.classList.add('success');
    status.textContent = 'Thank you. Your email application is opening so you can review and send your message.';
  });
});
//  Makes the navbar smaller once the visitor scrolls down. */

function initNavbar() {
  function update() {
    $(".navbar").toggleClass("scrolled", $(window).scrollTop() > 60);
  }

  $(window).on("scroll", update);
  update();
}

/*  FADE-IN ON SCROLL
   Every element with the class "reveal" fades in when it comes into view. */

function initReveal() {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  $(".reveal").each(function () {
    observer.observe(this);
  });
}

/*  MOVEMENT TABS
   Each button has data-tab="name". The matching panel has data-panel="name". */

function initMovementTabs() {
  $(".tab-btn").on("click", function () {
    const name = $(this).data("tab");

    $(".tab-btn").removeClass("active");
    $(this).addClass("active");

    $(".tab-panel")
      .removeClass("active")
      .filter(`[data-panel="${name}"]`)
      .addClass("active");
  });
}

/*  MECHANICAL WATCH STEPS
   Steps move on by themselves every few seconds until the visitor clicks one. */

function initSteps() {
  const TOTAL_STEPS = 5;
  const SECONDS_APART = 4;
  let current = 1;

  function showStep(number) {
    current = number;

    $(".step-btn")
      .removeClass("active")
      .filter(`[data-step="${number}"]`)
      .addClass("active");

    $(".step-detail")
      .removeClass("active")
      .filter(`[data-detail="${number}"]`)
      .addClass("active");
  }

  const autoPlay = setInterval(function () {
    showStep(current === TOTAL_STEPS ? 1 : current + 1);
  }, SECONDS_APART * 1000);

  $(".step-btn").on("click", function () {
    clearInterval(autoPlay);
    showStep(Number($(this).data("step")));
  });
}

/* COMPARISON TABLE HIGHLIGHT
   Hovering a cell highlights its whole column (the first column is skipped). */

function initTableHighlight() {
  const table = $("#compareTable");

  table.find("th, td").on("mouseenter", function () {
    const column = $(this).index();
    if (column === 0) {
      return;
    }

    table.find("tr").each(function () {
      $(this).children().eq(column).addClass("column-hover");
    });
  });

  table.find("th, td").on("mouseleave", function () {
    table.find(".column-hover").removeClass("column-hover");
  });
}

/*  WATER RESISTANCE GUIDE
   Each activity has data-min (the depth it needs). It is safe when the
   chosen rating is the same or higher. */

function initWaterGuide() {
  function showRating(depth) {
    $(".activity").each(function () {
      const isSafe = depth >= Number($(this).data("min"));

      $(this)
        .toggleClass("safe", isSafe)
        .toggleClass("unsafe", !isSafe)
        .find(".status")
        .text(isSafe ? "Safe" : "Avoid");
    });
  }

  $(".depth-btn").on("click", function () {
    $(".depth-btn").removeClass("active");
    $(this).addClass("active");
    showRating(Number($(this).data("depth")));
  });

  showRating(30);
}

/* SERVICE REMINDER
   The selected option's value is how many years between services. */

function initServiceReminder() {
  const OLDEST_YEAR = 1950;

  function showResult(text, isDue) {
    $("#serviceResult")
      .removeClass("d-none result-ok result-due")
      .addClass(isDue ? "result-due" : "result-ok")
      .text(text);
  }

  $("#serviceForm").on("submit", function (event) {
    event.preventDefault();

    const thisYear = new Date().getFullYear();
    const lastYear = Number($("#lastService").val());
    const interval = Number($("#movementType").val());
    const isValidYear =
      Number.isInteger(lastYear) &&
      lastYear >= OLDEST_YEAR &&
      lastYear <= thisYear;

    if (!isValidYear) {
      showResult(
        `Please enter a year between ${OLDEST_YEAR} and ${thisYear}.`,
        true,
      );
      return;
    }

    const yearsPassed = thisYear - lastYear;
    const yearsLeft = interval - yearsPassed;

    if (yearsLeft <= 0) {
      showResult(
        `Service due now. It has been ${yearsPassed} years and we suggest a check every ${interval} years.`,
        true,
      );
    } else {
      showResult(
        `You are fine for now. Your next check is due in about ${yearsLeft} year${yearsLeft === 1 ? "" : "s"}.`,
        false,
      );
    }
  });
}

/*  START */

$(function () {
  $("body").addClass("js-ready"); // lets the CSS hide "reveal" items only when JavaScript is working

  initNavbar();
  initReveal();
  initMovementTabs();
  initSteps();
  initTableHighlight();
  initWaterGuide();
  initServiceReminder();
});

/*
  Alberto Watch Company - home page script (front-end only)

  Sections in this file:
  1. Three.js helpers (renderer and shiny reflections)
  2. The 3D watch
  3. Hero scene (watch + gold dust)
  4. 3D gears
  5. Page effects (navbar, fade-in, counters, word changer, live clock, tilt cards)
  6. Newsletter form
  7. Start
*/

/* 1. THREE.JS HELPERS */

// Makes a renderer for a canvas. Returns null if the browser has no WebGL.
function createRenderer(canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    return renderer;
  } catch (error) {
    return null;
  }
}

// Gold only looks like metal when it has something to reflect.
// This paints a simple "studio" picture (dark room with bright lights)
// and uses it as the reflection for every shiny material in the scene.
function createReflections(renderer) {
  const paint = document.createElement("canvas");
  paint.width = 1024;
  paint.height = 512;
  const ctx = paint.getContext("2d");

  const room = ctx.createLinearGradient(0, 0, 0, 512);
  room.addColorStop(0, "#2a2a33");
  room.addColorStop(0.5, "#3b3226");
  room.addColorStop(1, "#0b0b0b");
  ctx.fillStyle = room;
  ctx.fillRect(0, 0, 1024, 512);

  // Bright "light boxes" that appear as highlights on the gold
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(120, 90, 220, 130);
  ctx.fillRect(640, 60, 260, 100);
  ctx.fillStyle = "#ffe3a3";
  ctx.fillRect(420, 200, 120, 200);
  ctx.fillRect(0, 230, 1024, 14);

  const texture = new THREE.CanvasTexture(paint);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.encoding = THREE.sRGBEncoding;

  const generator = new THREE.PMREMGenerator(renderer);
  const result = generator.fromEquirectangular(texture).texture;

  generator.dispose();
  texture.dispose();
  return result;
}

// Keeps the canvas sharp and the camera correct when the window changes size.
function fitCanvas(renderer, camera, canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  return width;
}

// Calls drawFrame on every screen refresh, but only while the canvas is visible.
function animateWhenVisible(canvas, drawFrame) {
  let isVisible = true;

  new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }).observe(canvas);

  const clock = new THREE.Clock();

  function loop() {
    requestAnimationFrame(loop);
    if (isVisible) {
      drawFrame(clock.getElapsedTime());
    }
  }
  loop();
}

// Where the mouse (or finger) is, from -1 to 1 on each axis
const pointer = { x: 0, y: 0 };

window.addEventListener("pointermove", function (event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
});

/* 2. THE 3D WATCH */

// Draws the watch face (numbers, marks and name) onto a canvas picture
function createDialTexture() {
  const size = 1024;
  const paint = document.createElement("canvas");
  paint.width = paint.height = size;
  const ctx = paint.getContext("2d");
  const middle = size / 2;

  const face = ctx.createRadialGradient(
    middle,
    middle,
    40,
    middle,
    middle,
    middle,
  );
  face.addColorStop(0, "#1d2638");
  face.addColorStop(1, "#05070c");
  ctx.fillStyle = face;
  ctx.fillRect(0, 0, size, size);

  // 60 small marks around the edge, with a bigger mark every 5
  for (let i = 0; i < 60; i++) {
    const isHour = i % 5 === 0;

    ctx.save();
    ctx.translate(middle, middle);
    ctx.rotate((i / 60) * Math.PI * 2);
    ctx.fillStyle = isHour ? "#e6c677" : "#8c7a4a";
    ctx.fillRect(-(isHour ? 8 : 3), -470, isHour ? 16 : 6, isHour ? 70 : 28);
    ctx.restore();
  }

  ctx.fillStyle = "#e6c677";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 86px Georgia, serif";
  ctx.fillText("12", middle, 270);
  ctx.fillText("6", middle, 755);
  ctx.fillText("3", 755, middle);
  ctx.fillText("9", 270, middle);

  ctx.font = "bold 50px Georgia, serif";
  ctx.fillText("A L B E R T O", middle, 390);
  ctx.fillStyle = "#cfd3da";
  ctx.font = "30px Georgia, serif";
  ctx.fillText("AUTOMATIC", middle, 650);

  const texture = new THREE.CanvasTexture(paint);
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 8;
  return texture;
}

// A watch hand that turns around its base. Returns the group to rotate.
function createHand(length, width, color, z) {
  const geometry = new THREE.BoxGeometry(width, length, 0.04);
  geometry.translate(0, length / 2 - 0.15, 0); // base sits at the center, with a short tail

  const material = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.9,
    roughness: 0.25,
  });
  const hand = new THREE.Group();

  hand.add(new THREE.Mesh(geometry, material));
  hand.position.z = z;
  return hand;
}

function createWatch() {
  const watch = new THREE.Group();

  const gold = new THREE.MeshStandardMaterial({
    color: 0xc9a24b,
    metalness: 1,
    roughness: 0.22,
  });
  const darkGold = new THREE.MeshStandardMaterial({
    color: 0x9c7a2e,
    metalness: 1,
    roughness: 0.35,
  });
  const leather = new THREE.MeshStandardMaterial({
    color: 0x1b130e,
    metalness: 0,
    roughness: 0.65,
  });

  // Case, bezel (ring) and back
  const caseBody = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 0.5, 64),
    gold,
  );
  caseBody.rotation.x = Math.PI / 2;
  watch.add(caseBody);

  const bezel = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.11, 24, 96),
    gold,
  );
  bezel.position.z = 0.25;
  watch.add(bezel);

  // Dial (the face) and the glass over it
  const dial = new THREE.Mesh(
    new THREE.CircleGeometry(1.42, 64),
    new THREE.MeshStandardMaterial({
      map: createDialTexture(),
      metalness: 0.3,
      roughness: 0.5,
    }),
  );
  dial.position.z = 0.26;
  watch.add(dial);

  const glass = new THREE.Mesh(
    new THREE.CircleGeometry(1.45, 64),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.12,
    }),
  );
  glass.position.z = 0.42;
  watch.add(glass);

  // Hands
  const hourHand = createHand(0.8, 0.1, 0xe6c677, 0.3);
  const minuteHand = createHand(1.15, 0.07, 0xe6c677, 0.33);
  const secondHand = createHand(1.3, 0.025, 0xd64545, 0.36);
  watch.add(hourHand, minuteHand, secondHand);

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.12, 24),
    gold,
  );
  cap.rotation.x = Math.PI / 2;
  cap.position.z = 0.38;
  watch.add(cap);

  // Crown (the winding knob on the side)
  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.35, 24),
    darkGold,
  );
  crown.rotation.z = Math.PI / 2;
  crown.position.x = 1.72;
  watch.add(crown);

  // Strap (top and bottom) and the small gold lugs that hold it
  [1, -1].forEach(function (side) {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.2), leather);
    strap.position.set(0, side * 2.75, -0.05);
    watch.add(strap);

    [-0.7, 0.7].forEach(function (x) {
      const lug = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 0.4), gold);
      lug.position.set(x, side * 1.6, 0);
      watch.add(lug);
    });
  });

  // Called every frame to move the hands to the real time
  watch.updateTime = function () {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    secondHand.rotation.z = -(seconds / 60) * Math.PI * 2;
    minuteHand.rotation.z = -(minutes / 60) * Math.PI * 2;
    hourHand.rotation.z = -(hours / 12) * Math.PI * 2;
  };

  return watch;
}

/* 3. HERO SCENE (watch + gold dust) */

function createGoldDust() {
  const COUNT = 450;
  const positions = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const radius = 5 + Math.random() * 9;
    const angleA = Math.random() * Math.PI * 2;
    const angleB = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(angleB) * Math.cos(angleA);
    positions[i * 3 + 1] = radius * Math.sin(angleB) * Math.sin(angleA);
    positions[i * 3 + 2] = radius * Math.cos(angleB);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xe6c677,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    }),
  );
}

function initHeroScene() {
  const canvas = document.getElementById("heroCanvas");
  const renderer = createRenderer(canvas);

  if (!renderer) {
    $("body").addClass("no-webgl");
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 9;

  scene.environment = createReflections(renderer);

  // Lights: a soft overall light, a main light, and a gold glow from behind
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
  mainLight.position.set(3, 4, 6);
  scene.add(mainLight);

  const goldLight = new THREE.PointLight(0xe6c677, 2.2, 20);
  goldLight.position.set(-4, -2, 3);
  scene.add(goldLight);

  const watch = createWatch();
  const dust = createGoldDust();
  scene.add(watch, dust);

  // On wide screens the watch sits on the right. On phones it sits at the top.
  let restX = 0;
  let restY = 0;

  function resize() {
    const isWide = fitCanvas(renderer, camera, canvas) >= 992;

    restX = isWide ? 2.5 : 0;
    restY = isWide ? 0 : 1.9;
    watch.scale.setScalar(isWide ? 1 : 0.7);
  }
  window.addEventListener("resize", resize);
  resize();

  animateWhenVisible(canvas, function (time) {
    watch.updateTime();

    // The watch turns slowly toward the mouse and gently floats
    const scrollTurn = window.scrollY * 0.004;
    const targetY =
      pointer.x * 0.5 - 0.35 + Math.sin(time * 0.5) * 0.2 + scrollTurn;
    const targetX = pointer.y * 0.3 + Math.cos(time * 0.4) * 0.08;

    watch.rotation.y += (targetY - watch.rotation.y) * 0.05;
    watch.rotation.x += (targetX - watch.rotation.x) * 0.05;
    watch.position.set(restX, restY + Math.sin(time * 1.1) * 0.12, 0);

    dust.rotation.y = time * 0.03;
    dust.rotation.x = time * 0.015;

    renderer.render(scene, camera);
  });
}

/* 4. 3D GEARS */

// Builds one gear. A gear is a flat outline with teeth, pushed out to make it thick.
function createGear(teeth, radius, color) {
  const rootRadius = radius * 0.82;
  const toothAngle = (Math.PI * 2) / teeth;
  const outline = new THREE.Shape();

  for (let i = 0; i < teeth; i++) {
    const start = i * toothAngle;

    // Each tooth has four corners: base, top, top, base
    [
      [start, rootRadius],
      [start + toothAngle * 0.2, radius],
      [start + toothAngle * 0.5, radius],
      [start + toothAngle * 0.7, rootRadius],
    ].forEach(function (corner, index) {
      const x = Math.cos(corner[0]) * corner[1];
      const y = Math.sin(corner[0]) * corner[1];

      if (i === 0 && index === 0) {
        outline.moveTo(x, y);
      } else {
        outline.lineTo(x, y);
      }
    });
  }
  outline.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, radius * 0.28, 0, Math.PI * 2, true);
  outline.holes.push(hole);

  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: 0.4,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    bevelSegments: 2,
  });
  geometry.translate(0, 0, -0.2);

  return new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: color,
      metalness: 1,
      roughness: 0.3,
    }),
  );
}

function initGearScene() {
  const canvas = document.getElementById("gearCanvas");
  const renderer = createRenderer(canvas);

  if (!renderer) {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 11;

  scene.environment = createReflections(renderer);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(3, 4, 6);
  scene.add(light);

  // Three gears that touch each other (big, small, medium)
  const bigTeeth = 16,
    smallTeeth = 10,
    mediumTeeth = 12;

  const big = createGear(bigTeeth, 1.6, 0xc9a24b);
  const small = createGear(smallTeeth, 1.0, 0xe6c677);
  const medium = createGear(mediumTeeth, 1.2, 0xa8842f);

  // Gears touch when the distance between centers is about the sum of their radii
  big.position.set(-1.6, 0.3, 0);
  small.position.set(0.63, 1.13, 0);
  medium.position.set(1.57, -0.64, 0);
  small.rotation.z = Math.PI / smallTeeth; // turned by half a tooth so the teeth fit between each other
  medium.rotation.z = Math.PI / mediumTeeth;

  const gears = new THREE.Group();
  gears.add(big, small, medium);
  scene.add(gears);

  function resize() {
    fitCanvas(renderer, camera, canvas);
  }
  window.addEventListener("resize", resize);
  resize();

  animateWhenVisible(canvas, function (time) {
    // Gears that touch turn in opposite directions. Smaller gears turn faster.
    const speed = time * 0.4;

    big.rotation.z = speed;
    small.rotation.z = Math.PI / smallTeeth - speed * (bigTeeth / smallTeeth);
    medium.rotation.z =
      Math.PI / mediumTeeth + speed * (bigTeeth / mediumTeeth);

    gears.rotation.y += (pointer.x * 0.5 - gears.rotation.y) * 0.05;
    gears.rotation.x += (pointer.y * 0.3 - gears.rotation.x) * 0.05;

    renderer.render(scene, camera);
  });
}

/* 5. PAGE EFFECTS */

function initNavbarAndScroll() {
  function update() {
    const scrolled = $(window).scrollTop();
    const pageHeight = $(document).height() - $(window).height();

    $(".navbar").toggleClass("scrolled", scrolled > 60);
    $("#scrollProgress").css("width", (scrolled / pageHeight) * 100 + "%");
    $("#toTop").toggleClass("show", scrolled > 600);
  }

  $(window).on("scroll", update);
  update();

  $("#toTop").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });

  // Close the phone menu after choosing a link
  $(".navbar-nav .nav-link").on("click", function () {
    bootstrap.Collapse.getOrCreateInstance("#menu", { toggle: false }).hide();
  });
}

// Every element with the class "reveal" fades in when it comes into view
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

// Numbers count up from 0 once they are visible
function initCounters() {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        const counter = $(entry.target);
        const target = Number(counter.data("target"));

        $({ value: 0 }).animate(
          { value: target },
          {
            duration: 1800,
            step: function () {
              counter.text(Math.floor(this.value).toLocaleString());
            },
            complete: function () {
              counter.text(target.toLocaleString());
            },
          },
        );
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  $(".counter").each(function () {
    observer.observe(this);
  });
}

// The headline word changes every 3 seconds. The words come from data-words in the html.
function initWordChanger() {
  const word = $("#typed");
  const words = word.data("words");
  let index = 0;

  setInterval(function () {
    word.fadeTo(300, 0, function () {
      index = (index + 1) % words.length;
      word.text(words[index]).fadeTo(300, 1);
    });
  }, 3000);
}

// Shows today's date and the time in Karachi, updated every second
function initLiveClock() {
  const TIME_ZONE = "Asia/Karachi";

  function update() {
    const now = new Date();

    $("#liveDate").text(
      now.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: TIME_ZONE,
      }),
    );

    $("#liveTime").text(
      now.toLocaleTimeString("en-GB", {
        hour12: false,
        timeZone: TIME_ZONE,
      }),
    );
  }

  update();
  setInterval(update, 1000);
}

// Cards lean toward the mouse
function initTiltCards() {
  $(".tilt")
    .on("mousemove", function (event) {
      const box = this.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;

      $(this).css(
        "transform",
        `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`,
      );
    })
    .on("mouseleave", function () {
      $(this).css("transform", "");
    });
}

/* 6. NEWSLETTER FORM (front-end only: nothing is sent anywhere) */

function initNewsletter() {
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  $("#newsletterForm").on("submit", function (event) {
    event.preventDefault();

    const email = $("#newsEmail").val().trim();
    const message = $("#newsMsg");

    if (EMAIL_PATTERN.test(email)) {
      message.text("Thank you for subscribing!").css("color", "#c9a24b");
      this.reset();
    } else {
      message
        .text("Please enter a valid email address.")
        .css("color", "#ff7b7b");
    }
  });
}

/* 7. START */

$(function () {
  $("body").addClass("js-ready"); // lets the CSS hide "reveal" items only when JavaScript is working

  initNavbarAndScroll();
  initReveal();
  initCounters();
  initWordChanger();
  initLiveClock();
  initTiltCards();
  initNewsletter();

  initHeroScene();
  initGearScene();
});

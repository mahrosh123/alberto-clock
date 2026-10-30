/*
  Alberto Watch Company - gallery page script (front-end only)

  To add a photo: put the file in its folder (images/COUPLE, images/GENTS or
  images/LADIES) and add its file name to the matching list below.

  Sections in this file:
  1. Photo lists
  2. Settings and state
  3. Showing the photos
  4. Filter buttons and search
  5. Full-screen viewer
  6. Start
*/

/* 1. PHOTO LISTS
   "folder" is where the files are. "files" are the file names. */

const COLLECTIONS = {
  couple: {
    label: "Couple",
    folder: "../images/COUPLE/",
    files: [
      "075c9c860eb36e32497fc3b6082b5c7b.jpg",
      "1ce62705585f0a78fa5a42fa61156939.jpg",
      "1dbe6607576d25eeba0db9aff8cf3967.jpg",
      "25200c98bb5572d090f436e198cd37f0.jpg",
      "32fc1d1ef333ea0c8fbb52e13e4c6b94.jpg",
      "357b399e980bb3e9fb6de7bd3277a9b6.jpg",
      "3d887d7177417edf7a443f916e662e8d.jpg",
      "479fe5ac8dd159cda1b6d302fce00927.jpg",
      "49b97fe27fe4264a88d95289724e803b.jpg",
      "4d85238c9d8d55415cb774c31c42360e.jpg",
      "4f24f5120c2706bade80c4f318a1daa1.jpg",
      "4f65cfff28254466622a4dcbc5cad1b8.jpg",
      "50ee8afe942c2ef211d0b6f2d06bd76a.jpg",
      "53994c41add1aa5b81e8a9e04a692935.jpg",
      "5c14e616ca578b88020601d224fc47e4.jpg",
      "67cb48dcd28c8ceb02a1eb379774757a.jpg",
      "68502961ff8bab7731a2b8bbf0078d2d.jpg",
      "8b38e5c84c9f5851165dd6345e540b7a.jpg",
      "8e42a36521f511e5ee10a2ef7fc6d906.jpg",
      "9a2739f859e14bd1dbcc7812d0e5ab28.jpg",
      "9fce492845870c8cd9e8da7badd90caa.jpg",
      "9fdf74bd8104ce5764cdd3101f2864f9.jpg",
      "a46960d172116ed7c783a2d616e3230d.jpg",
      "aed2585f107edfd3d591d60864d7e84f.jpg",
      "b8cfb19a30de16eacbae962c6e3393df.jpg",
      "bb0e43ae5cccf57b6b2aecd538bb678b.jpg",
      "c1fa26970d93444d72926f684eca2707.jpg",
      "c99c668b11f62ac1925ee15d985a9f57.jpg",
      "cc16249f996d51648e1433371d49641d.jpg",
      "cd7e3b295b57a8b925f90e0a177e5ab8.jpg",
      "d19cf8bb8c956160e86e560b71c77c6c.jpg",
      "d64ac5551282e8219e5a1adf13687561.jpg",
      "dbb81ba042b1c26a46e5f6ebe92ee9d3.jpg",
      "e4dc6bac9c52b40bbf610e3cc125e981.jpg",
      "eb92c8954d3a5acf6a4b71e5d4193f11.jpg",
      "f142fb162b21a79be041982918052b1a.jpg",
      "f8371e9741e30ec7103b4f474e6bd06d.jpg",
      "fc7725c5858289be9b6613109e72817e.jpg",
    ],
  },

  gents: {
    label: "Gents",
    folder: "../images/GENTS/",
    files: [
      "0124e8290dbd34d44ec156cd86df9aa8.jpg",
      "01c3928f13310196a19ec4189c7766f7.jpg",
      "09c7beeec2caf3fe2fdae4396acb0241.jpg",
      "287ef2392ef8c40377fbe7f9d42380dc.jpg",
      "2e47da942cc4464a6d4022f3114ef8fb.jpg",
      "37ab5b0261507c31921468de8556b6d3.jpg",
      "3fc5a348b81875200f5226a514d37eed.jpg",
      "3feecf69da93a8758d8658735182b053.jpg",
      "42f9f1de8e42ff64bbbc08a4e8d6d7b6.jpg",
      "4e7961ddec4d2d44329ce7360b3d0b20.jpg",
      "5b88c37293c58d1172702e1711420a97.jpg",
      "5d52cdf57e29acd818bd7fa3000342af.jpg",
      "777842794022c5d252b7c02b82a954f0.jpg",
      "7a3dd498030c98f52532bca02a9ef48a.jpg",
      "7e6730a1ba332e9a93f9b254e0239e82.jpg",
      "84fdca4e629e041a7f286712523a82b2.jpg",
      "8737c6ee852f4d9d6ae8d7af3ed23633.jpg",
      "92efd9055431516fa89f032b7728bce8.jpg",
      "996dd5c05759df2709c6aac9640cc92c.jpg",
      "b8a2acdaea197e466ed8c40c744a3669.jpg",
      "bd969867aa24c6085bed03482013a310.jpg",
      "bf4f7ebea1637a84b00ca0d107948138.jpg",
      "c27d69c25492af2a8e77fc4d576d7dfc.jpg",
      "c68ff9d6993a506031fb6670ab31086c.jpg",
      "d1661c8c4a388ba3f0afe4bb11da7468.jpg",
      "d61d27a743c50ec5bdcdec9c6e233dd5.jpg",
      "e2022f69669b25d53ca93eca1427b4ee.jpg",
      "ea0c2b6a53d20b82d4581d87f9fa57b1.jpg",
      "ed0f3faa0fca3c99dd4792b38e8f239a.jpg",
      "fa5d2a6f7c330e8c42019d72033a2fcc.jpg",
      "fd7a2d585d1180924eea47c233da76ca.jpg",
    ],
  },

  ladies: {
    label: "Ladies",
    folder: "../images/LADIES/",
    files: [
      "01a941973fa59c452970ea29a65c4a70.jpg",
      "09d3289fa49643a25b133df49ac957d2.jpg",
      "11a4276e85dd231061640fbbc20abb5d.jpg",
      "167effa2ad5b7cc49110959919cceda4.jpg",
      "17e439da591932268bf2c316fa488649.jpg",
      "1ebb59c4c0ceca8e7ff278e1d27e6dcb.jpg",
      "2a3ec1a8d976a61072943cc327e45134.jpg",
      "43a7e8ca6e2c8b83ddd8d6a4122fe4b7.jpg",
      "43cf970d6cd4a7c4349441e316084285.jpg",
      "48be1efa6872379475839c8fcb77d721.jpg",
      "50ea196d4686986e79972d6e74ca799e.jpg",
      "52eaffdb0f567c8be21d774b5522cbe1.jpg",
      "579697762fda8fa9e6a7df0a98820196.jpg",
      "5f8eb046d580a5cfe1307d3fc9b5bac7.jpg",
      "62f58e4b6116c9262c346714d005af37.jpg",
      "721b7dac487aa3ccab1d2ae19b9db12d.jpg",
      "749be21da66584587856e60736e3464d.jpg",
      "778c173c24f4f005521f76c80ef406af.jpg",
      "78cf4b07110e7537f90c57e2468775be.jpg",
      "7d3934c6decb7e02eb980b1974205da6.jpg",
      "86d74af53229baba5c31ce7a0f904c1a.jpg",
      "87ca31d4efe3d4b35201294bbca991f0.jpg",
      "91c979610412de7a9aa9d19bf832c161.jpg",
      "939a5f5255331e5a5cab6687a09e6120.jpg",
      "980fb794688a292e32097a511eefee69.jpg",
      "9b0bd0bf1feed9ef164d88d13fa7b441.jpg",
      "a6290f474769bde466efc76307bd47eb.jpg",
      "aac6c26afb5893ecf5b74634180ebeb1.jpg",
      "c5997b9c2a20251fb90ed7f8849179a5.jpg",
      "d59e1011b216cfae1ebf3a101a765f33.jpg",
      "e6148557a1ee0346931574188fd29d9a.jpg",
      "e71d90b5a2ac62b825c9996f9f355ef3.jpg",
      "eb6cb559dfce6b0d1438343a7f91c168.jpg",
      "fd4b1844e110a24e32eff917601f00c0.jpg",
      "fe7ce79742fe4be4d36c8bc65ce26b7f.jpg",
    ],
  },

  other: {
    label: "Other",
    folder: "../images/",
    files: ["videoframe_4175.png", "videoframe_8174.png"],
  },
};

/* 2. SETTINGS AND STATE */

const PAGE_SIZE = 24; // how many photos appear at a time

const photos = []; // every photo: { key, label, src, name, failed }

const state = {
  filter: "all",
  query: "",
  visible: PAGE_SIZE, // how many matching photos are on screen now
};

// Turns the lists above into one flat list of photos
function buildPhotoList() {
  Object.keys(COLLECTIONS).forEach(function (key) {
    const set = COLLECTIONS[key];

    set.files.forEach(function (file, index) {
      photos.push({
        key: key,
        label: set.label,
        src: set.folder + file,
        name: `${set.label} design ${index + 1}`,
        failed: false,
      });
    });
  });
}

// Photos that match the chosen filter and the search words (broken images are skipped)
function matchingPhotos() {
  return photos.filter(function (photo) {
    const inFilter = state.filter === "all" || photo.key === state.filter;
    const inSearch =
      !state.query ||
      `${photo.label} ${photo.name}`.toLowerCase().includes(state.query);

    return !photo.failed && inFilter && inSearch;
  });
}

/* 3. SHOWING THE PHOTOS */

function photoCardHtml(photo, index) {
  return `
    <button class="photo-card" style="--i: ${index % PAGE_SIZE}" data-index="${index}" aria-label="Open ${photo.name}">
      <img src="${photo.src}" alt="${photo.name}" loading="lazy">
      <figcaption>
        <small>${photo.label}</small>
        <span>${photo.name}</span>
      </figcaption>
    </button>`;
}

let refreshTimer = null;

function showPhotos() {
  const matches = matchingPhotos();
  const shown = matches.slice(0, state.visible);

  $("#photoGrid").html(shown.map(photoCardHtml).join(""));

  // A photo that cannot be loaded is removed instead of showing a broken picture
  $("#photoGrid img").on("error", function () {
    const index = Number($(this).closest(".photo-card").data("index"));

    shown[index].failed = true;

    // Several photos can fail together, so refresh once after a short pause
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      showPhotos();
      showCounts();
    }, 150);
  });

  $("#emptyNote").toggleClass("d-none", matches.length > 0);
  $("#loadMore").toggle(matches.length > state.visible);
  $("#resultsLine").text(
    matches.length === 0
      ? ""
      : `Showing ${shown.length} of ${matches.length} photos`,
  );
}

// The small numbers on the filter buttons and in the hero
function showCounts() {
  const alive = photos.filter((photo) => !photo.failed);

  $(".filter-btn").each(function () {
    const key = $(this).data("filter");
    const count =
      key === "all" ? alive.length : alive.filter((p) => p.key === key).length;

    $(this).find("span").text(count);
  });

  $("#totalPhotos").text(alive.length);
}

/* 4. FILTER BUTTONS AND SEARCH */

function chooseFilter(key) {
  state.filter = key;
  state.visible = PAGE_SIZE;

  $(".filter-btn")
    .removeClass("active")
    .filter(`[data-filter="${key}"]`)
    .addClass("active");

  showPhotos();
}

function initFilters() {
  $(".filter-btn").on("click", function () {
    chooseFilter($(this).data("filter"));
  });

  $("#gallerySearch").on("input", function () {
    state.query = this.value.trim().toLowerCase();
    state.visible = PAGE_SIZE;
    showPhotos();
  });

  $("#loadMore").on("click", function () {
    state.visible += PAGE_SIZE;
    showPhotos();
  });

  // gallery.html?cat=gents opens the gents photos straight away
  const wanted = new URLSearchParams(window.location.search).get("cat");

  if (wanted && COLLECTIONS[wanted]) {
    chooseFilter(wanted);
  }
}

/* 5. FULL-SCREEN VIEWER */

function initViewer() {
  const box = $("#lightbox");
  let list = []; // the photos the viewer can move through
  let place = 0; // which one is open now

  function showCurrent() {
    const photo = list[place];

    $("#lbImage").attr({ src: photo.src, alt: photo.name });
    $("#lbCaption").text(photo.name);
    $("#lbCount").text(`${place + 1} of ${list.length}`);

    // Start loading the next photo so it opens instantly
    new Image().src = list[(place + 1) % list.length].src;
  }

  function open(index) {
    list = matchingPhotos();
    place = index;
    showCurrent();
    box.addClass("open").attr("aria-hidden", "false");
    $("body").css("overflow", "hidden");
  }

  function close() {
    box.removeClass("open").attr("aria-hidden", "true");
    $("body").css("overflow", "");
  }

  function move(step) {
    place = (place + step + list.length) % list.length;
    showCurrent();
  }

  $("#photoGrid").on("click", ".photo-card", function () {
    open(Number($(this).data("index")));
  });

  $("#lbClose").on("click", close);
  $("#lbPrev").on("click", () => move(-1));
  $("#lbNext").on("click", () => move(1));

  // Clicking the dark area around the photo also closes the viewer
  box.on("click", function (event) {
    if (event.target === this) {
      close();
    }
  });

  $(document).on("keydown", function (event) {
    if (!box.hasClass("open")) {
      return;
    }
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
}

/* 6. START */

$(function () {
  buildPhotoList();
  initFilters();
  initViewer();
  showPhotos();
  showCounts();

  $("#totalFilms").text($(".film-card").length);

  // Make sure the hero film starts playing (some browsers need a nudge)
  const film = document.querySelector(".hero-film");
  if (film) {
    film.play().catch(function () {
      /* The browser blocked autoplay: the dark background stays instead */
    });
  }
});

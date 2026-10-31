/* 1. SETTINGS */

const DELIVERY_FEE = 500;
const FREE_DELIVERY_AT = 100000;
const MAX_QUANTITY = 10;
const CART_STORAGE_KEY = "albertoCart";

const PAYMENT_NAMES = {
  cod: "Cash on Delivery",
  card: "Card",
  wallet: "Easypaisa / JazzCash",
  bank: "Bank Transfer",
};

/* 2. READ THE CARDS FROM THE PAGE
   Every card in the html has the class "product" and data-... attributes.
   This code collects them into a list so we can filter, sort and add to cart. */

const PRODUCTS = [];

function readProductsFromHtml() {
  $(".product").each(function () {
    const card = $(this);

    PRODUCTS.push({
      id: Number(card.attr("data-id")),
      name: card.find("h5").text(),
      brand: card.attr("data-brand"), // empty text means our own collection (no brand)
      cat: card.attr("data-cat"),
      gender: card.attr("data-gender"),
      price: Number(card.attr("data-price")),
      sold: Number(card.attr("data-sold")),
      date: card.attr("data-date"),
      img: card.find("img").attr("src"), // filled in the card html
      desc: card.attr("data-desc"),
      element: this, // the card itself, used to show or hide it
    });
  });
}

function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function formatPrice(amount) {
  return "Rs. " + amount.toLocaleString("en-US");
}

/* 3. VIEWS AND SORTING RULES
   A view is a page title plus a test that decides which watches to show. */

const VIEWS = {
  collection: { title: "Our Collection", test: (p) => p.brand === "" },
  men: { title: "Men", test: (p) => p.gender === "men" },
  women: { title: "Women", test: (p) => p.gender === "women" },
  brands: { title: "Brands", test: (p) => p.brand !== "" },
};

const SORTS = {
  best: (a, b) => b.sold - a.sold,
  new: (a, b) => new Date(b.date) - new Date(a.date),
  old: (a, b) => new Date(a.date) - new Date(b.date),
  high: (a, b) => b.price - a.price,
  low: (a, b) => a.price - b.price,
};

const pageState = {
  view: VIEWS.collection,
  navKey: "collection",
  sortKey: "best",
};

/* 4. CART DATA
   Items look like { id: 5, qty: 2 } and are saved in the visitor's browser. */

const Cart = {
  items: [],

  load() {
    try {
      this.items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (error) {
      this.items = [];
    }
  },

  save() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (error) {
      /* Storage is blocked. The cart still works until the page is closed. */
    }
  },

  add(id, qty) {
    const item = this.items.find((entry) => entry.id === id);

    if (item) {
      item.qty += qty;
    } else {
      this.items.push({ id, qty });
    }
    this.save();
  },

  changeQuantity(id, change) {
    const item = this.items.find((entry) => entry.id === id);

    item.qty += change;
    this.items = this.items.filter((entry) => entry.qty > 0);
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  count() {
    return this.items.reduce((total, item) => total + item.qty, 0);
  },

  subtotal() {
    return this.items.reduce((total, item) => {
      return total + findProduct(item.id).price * item.qty;
    }, 0);
  },

  delivery() {
    const subtotal = this.subtotal();
    const isFree = subtotal === 0 || subtotal >= FREE_DELIVERY_AT;

    return isFree ? 0 : DELIVERY_FEE;
  },

  total() {
    return this.subtotal() + this.delivery();
  },
};

/* 5. SHOWING PRODUCTS AND THE CART */

function showProducts() {
  const visible = PRODUCTS.filter(pageState.view.test).sort(
    SORTS[pageState.sortKey],
  );

  // Hide every card, then show the matching ones in sorted order
  $(".product").addClass("d-none");
  visible.forEach((product) => {
    $(product.element).removeClass("d-none").appendTo("#productGrid");
  });

  $("#viewTitle").text(pageState.view.title);
  $("#resultCount").text(`Showing ${visible.length} watches`);

  $("[data-view]")
    .removeClass("active")
    .filter(`[data-view="${pageState.navKey}"]`)
    .addClass("active");
}

function cartRowHtml(item) {
  const product = findProduct(item.id);
  const brandLine = product.brand ? `<small>${product.brand}</small><br>` : "";

  return `
    <div class="cart-row">
      <img src="${product.img}" alt="">
      <div class="info">
        <strong>${product.name}</strong><br>
        ${brandLine}
        ${formatPrice(product.price)}
      </div>
      <div class="text-nowrap">
        <button class="qty-btn" data-id="${product.id}" data-change="-1">−</button>
        <span class="mx-1">${item.qty}</span>
        <button class="qty-btn" data-id="${product.id}" data-change="1">+</button>
      </div>
    </div>`;
}

function showCart() {
  const rows = Cart.items.map(cartRowHtml).join("");

  $("#cartItems").html(
    rows || '<p class="text-secondary">Your cart is empty.</p>',
  );
  $("#cartTotal").text(formatPrice(Cart.subtotal()));
  $("#cartCount").text(Cart.count());
}

function bumpCartBadge() {
  $("#cartCount")
    .addClass("bump")
    .one("animationend", function () {
      $(this).removeClass("bump");
    });
}

function closeOpenPanels() {
  $(".offcanvas.show").each(function () {
    bootstrap.Offcanvas.getInstance(this).hide();
  });
}

/* 6. NAVIGATION AND SORTING */

function changeView(navKey, view) {
  pageState.navKey = navKey;
  pageState.view = view;

  closeOpenPanels();
  bootstrap.Collapse.getOrCreateInstance("#navLinks", { toggle: false }).hide();
  showProducts();
  $("html, body").animate({ scrollTop: 0 }, 300);
}

function initNavigation() {
  // Navbar: Our Collection, Men, Women, Brands
  $("[data-view]").on("click", function (event) {
    event.preventDefault();
    const key = $(this).data("view");

    changeView(key, VIEWS[key]);
  });

  // Menu panel: Luxury, Vintage, Smart
  $("#menuAside [data-cat]").on("click", function (event) {
    event.preventDefault();
    const category = $(this).data("cat");
    const title = $(this).text().trim();

    changeView("", { title: title, test: (p) => p.cat === category });
  });

  // Menu panel: Rolex, Michael Kors, Omega
  $("#menuAside [data-brand]").on("click", function (event) {
    event.preventDefault();
    const brand = $(this).data("brand");

    changeView("", { title: brand, test: (p) => p.brand === brand });
  });

  // Filters panel: sort order
  $("input[name=sort]").on("change", function () {
    pageState.sortKey = this.value;
    showProducts();
  });
}

/* 7. QUICK VIEW */

function initQuickView() {
  const modal = new bootstrap.Modal("#quickModal");
  let selected = null;

  function getQuantity() {
    return Number($("#qvQty").val());
  }

  function setQuantity(value) {
    $("#qvQty").val(Math.min(MAX_QUANTITY, Math.max(1, value)));
  }

  // Quick View button on a card
  $("#productGrid").on("click", ".quick-view", function () {
    const id = Number($(this).closest(".product").attr("data-id"));
    selected = findProduct(id);

    $("#qvImg").attr({ src: selected.img, alt: selected.name });
    $("#qvBrand")
      .text(selected.brand)
      .toggleClass("d-none", selected.brand === "");
    $("#qvName").text(selected.name);
    $("#qvDesc").text(selected.desc);
    $("#qvPrice").text(formatPrice(selected.price));
    setQuantity(1);

    modal.show();
  });

  $("#qvPlus").on("click", () => setQuantity(getQuantity() + 1));
  $("#qvMinus").on("click", () => setQuantity(getQuantity() - 1));

  $("#qvAdd").on("click", function () {
    Cart.add(selected.id, getQuantity());
    showCart();
    bumpCartBadge();
    modal.hide();
    bootstrap.Offcanvas.getOrCreateInstance("#cartPanel").show();
  });
}

/* 8. CART PANEL */

function initCartPanel() {
  $("#cartItems").on("click", ".qty-btn", function () {
    const id = Number($(this).data("id"));
    const change = Number($(this).data("change"));

    Cart.changeQuantity(id, change);
    showCart();
  });
}

/* 9. CHECKOUT AND PAYMENT */

const RULES = {
  name: (v) => v.length >= 3,
  phone: (v) => /^[0-9+\-\s]{10,15}$/.test(v),
  address: (v) => v.length >= 6,
  city: (v) => v.length >= 2,
  card: (v) => v.replace(/\s/g, "").length === 16,
  expiry: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v),
  cvv: (v) => /^\d{3,4}$/.test(v),
};

function validateField(selector, rule) {
  const isValid = rule($(selector).val().trim());

  $(selector).toggleClass("is-invalid", !isValid);
  return isValid;
}

function formIsValid(paymentMethod) {
  const results = [
    validateField("#fName", RULES.name),
    validateField("#fPhone", RULES.phone),
    validateField("#fAddress", RULES.address),
    validateField("#fCity", RULES.city),
  ];

  if (paymentMethod === "card") {
    results.push(validateField("#cNum", RULES.card));
    results.push(validateField("#cExp", RULES.expiry));
    results.push(validateField("#cCvv", RULES.cvv));
  }

  return !results.includes(false);
}

function orderSummaryHtml() {
  const lines = Cart.items.map((item) => {
    const product = findProduct(item.id);
    const price = formatPrice(product.price * item.qty);

    return `<div><span>${product.name} × ${item.qty}</span><span>${price}</span></div>`;
  });

  const deliveryText = Cart.delivery() ? formatPrice(Cart.delivery()) : "Free";

  return (
    lines.join("") +
    `
    <div><span>Delivery</span><span>${deliveryText}</span></div>
    <div class="grand"><span>Total</span><span>${formatPrice(Cart.total())}</span></div>`
  );
}

function resetCheckoutForm() {
  $("#checkoutForm").removeClass("d-none")[0].reset();
  $("#orderDone").addClass("d-none");
  $(".pay-detail").addClass("d-none");
  $(".is-invalid").removeClass("is-invalid");
  $("#orderSummary").html(orderSummaryHtml());
}

function completeOrder(paymentMethod) {
  const total = formatPrice(Cart.total());
  const phone = $("#fPhone").val();

  $("#orderNo").text("AWC-" + Math.floor(100000 + Math.random() * 900000));
  $("#orderMsg").text(
    `Total ${total} · Payment: ${PAYMENT_NAMES[paymentMethod]}. We will call ${phone} to confirm.`,
  );
  $("#checkoutForm").addClass("d-none");
  $("#orderDone").removeClass("d-none");

  Cart.clear();
  showCart();
}

function initCheckout() {
  const modal = new bootstrap.Modal("#checkoutModal");

  $("#checkoutBtn").on("click", function () {
    if (Cart.items.length === 0) {
      $("#cartItems").html(
        '<p class="text-warning">Add a watch before checking out.</p>',
      );
      return;
    }

    resetCheckoutForm();
    bootstrap.Offcanvas.getInstance("#cartPanel").hide();
    modal.show();
  });

  // Show the extra box for the chosen payment method
  $("input[name=pay]").on("change", function () {
    const extraBox = {
      card: "#payCard",
      wallet: "#payWallet",
      bank: "#payBank",
    }[this.value];

    $(".pay-detail").addClass("d-none");
    if (extraBox) {
      $(extraBox).removeClass("d-none");
    }
  });

  // Card number becomes "1234 5678 9012 3456"
  $("#cNum").on("input", function () {
    this.value = this.value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  });

  // Expiry becomes "MM/YY"
  $("#cExp").on("input", function () {
    const digits = this.value.replace(/\D/g, "").slice(0, 4);

    this.value =
      digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  });

  // Place order (demo only: no real payment is taken)
  $("#checkoutForm").on("submit", function (event) {
    event.preventDefault();
    const paymentMethod = $("input[name=pay]:checked").val();

    if (formIsValid(paymentMethod)) {
      completeOrder(paymentMethod);
    }
  });
}

/* 10. START */

$(function () {
  readProductsFromHtml();
  Cart.load();
  showProducts();
  showCart();

  initNavigation();
  initQuickView();
  initCartPanel();
  initCheckout();
});

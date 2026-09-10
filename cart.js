(function () {
  const CART_KEY = "brandstore_cart_v1";
  const CUSTOM_KEY = "brandstore_custom_products_v1";
  const SHIPPING_THRESHOLD = 1000;

  let catalogMap = new Map();
  let customMap = readJson(CUSTOM_KEY, {});
  let cart = readJson(CART_KEY, []);
  let discountOpen = true;
  let discountCode = "";
  let discountError = "";

  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

  function normalize(text) {
    return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function parsePrice(text) {
    const match = (text || "").match(/\$\s*([0-9]+(?:\.[0-9]+)?)/);
    return match ? Number(match[1]) : 0;
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureDrawer() {
    if (document.getElementById("cart-drawer")) return;

    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.id = "cart-overlay";

    const drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.id = "cart-drawer";
    drawer.innerHTML = `
      <div class="drawer-shipping" id="drawer-shipping"></div>
      <div class="drawer-header">
        <button class="drawer-close" type="button" id="drawer-close" aria-label="Close cart">→</button>
        <h3 class="drawer-title" id="drawer-title">Your Cart Is Empty</h3>
        <span class="drawer-count" id="drawer-count">0</span>
      </div>
      <div class="drawer-body" id="drawer-body"></div>
      <div class="drawer-footer" id="drawer-footer"></div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    overlay.addEventListener("click", closeDrawer);
    drawer.querySelector("#drawer-close").addEventListener("click", closeDrawer);

    drawer.addEventListener("click", (event) => {
      const proceedBtn = event.target.closest("[data-proceed-checkout]");
      if (proceedBtn) {
        window.location.href = "Contact.html";
        return;
      }

      const shopNowBtn = event.target.closest("[data-shop-now]");
      if (shopNowBtn) {
        window.location.href = "Everything.html";
        return;
      }

      const discountToggle = event.target.closest("[data-discount-toggle]");
      if (discountToggle) {
        discountOpen = !discountOpen;
        renderDrawer();
        return;
      }

      const applyBtn = event.target.closest("[data-discount-apply]");
      if (applyBtn) {
        const input = drawer.querySelector("#discount-code-input");
        discountCode = input ? input.value.trim() : "";
        discountError = discountCode
          ? `Coupon "${discountCode}" cannot be applied because it does not exist.`
          : "Please enter a coupon code.";
        renderDrawer();
        return;
      }

      const actionBtn = event.target.closest("[data-cart-action]");
      if (!actionBtn) return;

      const id = actionBtn.dataset.id;
      const action = actionBtn.dataset.cartAction;

      if (action === "inc") changeQty(id, 1);
      if (action === "dec") changeQty(id, -1);
      if (action === "remove") removeItem(id);
    });
  }

  function openDrawer() {
    ensureDrawer();
    document.body.classList.add("cart-open");
    renderDrawer();
  }

  function closeDrawer() {
    document.body.classList.remove("cart-open");
  }

  function loadCatalog() {
    return fetch("products.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        catalogMap = new Map();
        list.forEach((item) => {
          catalogMap.set(item.id, item);
          catalogMap.set(normalize(item.title), item);
        });
      })
      .catch(() => {
        catalogMap = new Map();
      });
  }

  function resolveItem(id) {
    if (customMap[id]) return customMap[id];
    return catalogMap.get(id) || null;
  }

  function getCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function getUniqueItemCount() {
    return cart.length;
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => {
      const product = resolveItem(item.id);
      if (!product) return sum;
      return sum + product.price * item.qty;
    }, 0);
  }

  function saveCart() {
    cart = cart.filter((item) => item.qty > 0);
    writeJson(CART_KEY, cart);
    writeJson(CUSTOM_KEY, customMap);
    syncHeader();
    renderDrawer();
  }

  function addByTitle(title, fallbackData = {}, qty = 1) {
    if (!title) return;
    const normalized = normalize(title);
    const matched = catalogMap.get(normalized);

    let id = normalized;
    if (matched) {
      id = matched.id;
    } else if (!customMap[id]) {
      customMap[id] = {
        id,
        title,
        category: fallbackData.category || "Store",
        image: fallbackData.image || "images/product-accessory2-300x300.jpg",
        price: parsePrice(fallbackData.price || "$150.00") || 150
      };
    }

    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += Math.max(1, Number(qty) || 1);
    } else {
      cart.push({ id, qty: Math.max(1, Number(qty) || 1) });
    }

    saveCart();
  }

  function removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
  }

  function changeQty(id, delta) {
    const line = cart.find((item) => item.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) removeItem(id);
    else saveCart();
  }

  function renderDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;

    const count = getCount();
    const uniqueCount = getUniqueItemCount();
    const subtotal = getSubtotal();
    const away = Math.max(0, SHIPPING_THRESHOLD - subtotal);

    drawer.querySelector("#drawer-count").textContent = String(uniqueCount);
    drawer.querySelector("#drawer-title").textContent = uniqueCount ? "Review Your Cart" : "Your Cart Is Empty";
    drawer.querySelector("#drawer-shipping").innerHTML = away
      ? `You're <strong>${fmt.format(away)}</strong> away from free shipping!`
      : "You have unlocked free shipping!";

    const body = drawer.querySelector("#drawer-body");
    const footer = drawer.querySelector("#drawer-footer");

    if (!uniqueCount) {
      body.innerHTML = '<p class="drawer-empty">Check out our shop to see what\'s available</p>';
      footer.innerHTML = `
        <div class="drawer-row"><span>Total</span><strong>${fmt.format(0)}</strong></div>
        <button class="drawer-action" data-shop-now type="button">Your cart is empty. Shop now →</button>
      `;
      return;
    }

    body.innerHTML = cart
      .map((line) => {
        const product = resolveItem(line.id);
        if (!product) return "";
        const lineTotal = product.price * line.qty;
        return `
          <article class="cart-item">
            <img src="${product.image}" alt="${product.title}">
            <div>
              <a class="cart-item-title" href="Product.html?title=${encodeURIComponent(product.title)}&cat=${encodeURIComponent(product.category)}&price=${encodeURIComponent(fmt.format(product.price))}&image=${encodeURIComponent(product.image)}">${product.title}</a>
              <p class="cart-item-price">${fmt.format(lineTotal)}</p>
              <button class="cart-remove" data-cart-action="remove" data-id="${line.id}" type="button">REMOVE</button>
            </div>
            <div class="cart-qty">
              <button data-cart-action="inc" data-id="${line.id}" type="button">+</button>
              <span>${line.qty}</span>
              <button data-cart-action="dec" data-id="${line.id}" type="button">-</button>
            </div>
          </article>
        `;
      })
      .join("");

    footer.innerHTML = `
      <div class="discount-wrap">
        <button class="discount-toggle" data-discount-toggle type="button">
          <span>Got a Discount Code?</span>
          <i class="bi ${discountOpen ? "bi-chevron-up" : "bi-chevron-down"}" data-discount-toggle></i>
        </button>
        <div class="discount-body ${discountOpen ? "" : "hidden"}">
          <div class="discount-row">
            <input id="discount-code-input" class="${discountError ? "error" : ""}" type="text" placeholder="Enter discount code" value="${escapeHtml(discountCode)}">
            <button data-discount-apply type="button">Apply</button>
          </div>
          ${discountError ? `<p class="discount-error">${escapeHtml(discountError)}</p>` : ""}
        </div>
      </div>
      <div class="drawer-row"><span>Subtotal</span><strong>${fmt.format(subtotal)}</strong></div>
      <div class="drawer-row"><span>Total</span><strong>${fmt.format(subtotal)}</strong></div>
      <button class="drawer-action" data-proceed-checkout type="button">Proceed to Checkout →</button>
    `;
  }

  function syncHeader() {
    const count = getCount();
    const subtotal = getSubtotal();

    document.querySelectorAll(".cart-count, .floating-cart-count").forEach((el) => {
      el.textContent = String(count);
    });

    document.querySelectorAll('a[href="Cart.html"]').forEach((a) => {
      const txt = a.textContent.trim();
      if (/^\$/.test(txt)) a.textContent = fmt.format(subtotal);
    });
  }

  function bindCartTriggers() {
    document.querySelectorAll('a[href="Cart.html"], .floating-cart').forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        openDrawer();
      });
    });
  }

  function bindAddButtons() {
    document.addEventListener("click", (event) => {
      const btn = event.target.closest(".add-to-cart-btn");
      if (!btn) return;

      event.preventDefault();
      event.stopPropagation();

      addByTitle(
        btn.dataset.productTitle,
        {
          category: btn.dataset.productCat,
          image: btn.dataset.productImage,
          price: btn.dataset.productPrice
        },
        1
      );

      openDrawer();
    });

    const pdpButton = document.querySelector(".cart-row button");
    if (pdpButton) {
      pdpButton.addEventListener("click", () => {
        const title = document.getElementById("product-title")?.textContent?.trim();
        const cat = document.getElementById("product-cats")?.textContent?.split(",")[0]?.trim() || "Store";
        const image = document.getElementById("product-image")?.getAttribute("src") || "";
        const price = document.getElementById("product-price")?.textContent || "$150.00";
        const qty = Number(document.querySelector('.cart-row input[type="number"]')?.value || 1);

        addByTitle(title, { category: cat, image, price }, qty);
        openDrawer();
      });
    }
  }

  function init() {
    ensureDrawer();
    bindCartTriggers();
    bindAddButtons();
    syncHeader();
    renderDrawer();
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadCatalog().finally(init);
  });
})();

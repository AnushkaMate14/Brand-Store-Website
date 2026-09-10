const products = [
  {
    title: "Anchor Bracelet",
    cat: "Accessories",
    price: "$150.00 - $180.00",
    image: "images/product-accessory2-300x300.jpg"
  },
  {
    title: "Black Over-the-shoulder Handbag",
    cat: "Accessories",
    price: "$150.00",
    image: "images/product-bag2-300x300.jpg"
  },
  {
    title: "Boho Bangle Bracelet",
    cat: "Accessories",
    price: "$150.00 - $170.00",
    image: "images/product-accessory1-300x300.jpg",
    dots: ["cyan", "green", "orange"]
  },
  {
    title: "Bright Gold Purse With Chain",
    cat: "Accessories",
    price: "$150.00",
    image: "images/product-bag2-300x300.jpg"
  },
  {
    title: "Bright Red Bag",
    cat: "Accessories",
    price: "$100.00 - $140.00",
    image: "images/product-bag3-300x300.jpg",
    dots: ["blue", "yellow", "purple", "orange"]
  },
  {
    title: "Buddha Bracelet",
    cat: "Accessories",
    price: "$150.00",
    image: "images/product-accessory3-300x300.jpg"
  },
  {
    title: "Light Brown Purse",
    cat: "Accessories",
    price: "$150.00",
    image: "images/product-bag1-300x300.jpg"
  }
];

const grid = document.getElementById("product-grid");

function renderDots(item) {
  if (!item.dots || item.dots.length === 0) return "";
  const dotHtml = item.dots.map((dot) => `<span class="dot ${dot}"></span>`).join("");
  return `<p class="dots">${dotHtml}</p>`;
}

function buildProductUrl(item) {
  const params = new URLSearchParams();
  params.set("title", item.title);
  params.set("cat", item.cat);
  params.set("price", item.price);
  params.set("image", item.image);
  if (item.dots && item.dots.length) params.set("dots", item.dots.join(","));
  return `Product.html?${params.toString()}`;
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderCard(item) {
  const productUrl = buildProductUrl(item);
  return `
    <article class="product-card">
      <a class="product-link" href="${productUrl}">
        <div class="product-img">
          <button class="add-to-cart-btn" type="button" data-product-title="${escapeAttr(item.title)}" data-product-cat="${escapeAttr(item.cat)}" data-product-image="${escapeAttr(item.image)}" data-product-price="${escapeAttr(item.price)}" aria-label="Add to cart"><span class="add-tip">Add to cart</span><i class="bi bi-bag-fill"></i></button>
          <img src="${item.image}" alt="${item.title}">
        </div>
      </a>
      <h3><a class="product-link" href="${productUrl}">${item.title}</a></h3>
      <p class="cat">${item.cat}</p>
      <p class="price">${item.price}</p>
      ${renderDots(item)}
    </article>
  `;
}

grid.innerHTML = products.map(renderCard).join("");

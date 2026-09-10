function getParam(name, fallback = "") {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(name);
  return value && value.trim() ? value : fallback;
}

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildProductUrl(item) {
  const params = new URLSearchParams();
  params.set("title", item.title);
  params.set("cat", item.cat);
  params.set("price", item.price);
  params.set("image", item.image);
  if (item.oldPrice) params.set("oldPrice", item.oldPrice);
  if (item.dots && item.dots.length) params.set("dots", item.dots.join(","));
  return `Product.html?${params.toString()}`;
}

const product = {
  title: getParam("title", "Anchor Bracelet"),
  cat: getParam("cat", "Accessories"),
  price: getParam("price", "$150.00 - $180.00"),
  oldPrice: getParam("oldPrice", ""),
  image: getParam("image", "images/product-accessory2-300x300.jpg"),
  dots: getParam("dots", "black,mustard,orange").split(",").filter(Boolean),
};

const titleEl = document.getElementById("product-title");
const imageEl = document.getElementById("product-image");
const catLineEl = document.getElementById("product-cats");
const crumbEl = document.getElementById("product-crumb");
const priceEl = document.getElementById("product-price");
const metaEl = document.getElementById("product-meta");
const colorsEl = document.getElementById("product-colors");
const topPriceEl = document.getElementById("top-price");

const primaryCat = product.cat.includes(",")
  ? product.cat.split(",")[0].trim()
  : product.cat;
const catLine =
  product.cat === "Accessories" ? "Accessories, Women" : product.cat;

titleEl.textContent = product.title;
imageEl.src = product.image;
imageEl.alt = product.title;
catLineEl.textContent = catLine;
crumbEl.textContent = `Home / ${primaryCat} / ${product.title}`;
metaEl.textContent = `SKU: N/A   Categories: ${catLine}`;

if (product.oldPrice) {
  priceEl.innerHTML = `<span class="old-price">${product.oldPrice}</span> ${product.price} <span>+ Free Shipping</span>`;
  topPriceEl.textContent = product.price;
} else {
  priceEl.innerHTML = `${product.price} <span>+ Free Shipping</span>`;
  topPriceEl.textContent = product.price;
}

colorsEl.innerHTML = product.dots
  .map((dot) => `<span class="dot ${dot}"></span>`)
  .join("");

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;

    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".tab-panel")
      .forEach((p) => p.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(`tab-${tab}`).classList.add("active");
  });
});

const relatedItems = [
  {
    title: "Basic Gray Jeans",
    cat: "Women",
    price: "$150.00",
    image: "images/product-w-jeans4-300x300.jpg",
  },
  {
    title: "Gray Pattern Tshirt",
    cat: "Women",
    price: "$30.00 - $34.00",
    image: "images/tshirt3-300x300.jpg",
  },
  {
    title: "Bright Gold Purse With Chain",
    cat: "Accessories",
    price: "$150.00",
    image: "images/product-bag2-300x300.jpg",
  },
].filter((item) => slugify(item.title) !== slugify(product.title));

document.getElementById("related-grid").innerHTML = relatedItems
  .slice(0, 3)
  .map(
    (item) => `
  <a class="related-card" href="${buildProductUrl(item)}">
    <div class="img-wrap"><img src="${item.image}" alt="${item.title}"></div>
    <h3>${item.title}</h3>
    <p class="cat">${item.cat}</p>
    <p class="price">${item.price}</p>
  </a>
`,
  )
  .join("");

const productsByPage = {
  1: [
    {
      title: "Anchor Bracelet",
      cat: "Accessories",
      price: "$150.00 - $180.00",
      image: "images/product-accessory2-300x300.jpg"
    },
    {
      title: "Basic Gray Jeans",
      cat: "Women",
      price: "$150.00",
      image: "images/product-w-jeans4-300x300.jpg"
    },
    {
      title: "Black Over-the-shoulder Handbag",
      cat: "Accessories",
      price: "$150.00",
      image: "images/product-bag2-300x300.jpg"
    },
    {
      title: "Blue Denim Jeans",
      cat: "Women",
      price: "$150.00",
      image: "images/product-w-jeans2-300x300.jpg"
    },
    {
      title: "Blue Denim Shorts",
      cat: "Women",
      price: "$130.00",
      oldPrice: "$150.00",
      sale: true,
      image: "images/product-w-jeans1-300x300.jpg"
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
      image: "images/product-accessory3-300x300.jpg",
      quickAdd: true
    },
    {
      title: "DNK Black Shoes",
      cat: "Women",
      price: "$175.00 - $200.00",
      image: "images/sports-shoe1-300x300.jpg",
      dots: ["cyan", "blue", "green", "orange"]
    },
    {
      title: "Flamingo Tshirt",
      cat: "Women",
      price: "$25.00 - $28.00",
      image: "images/tshirt3-300x300.jpg",
      dots: ["blue", "yellow", "purple", "mustard"],
      sizes: ["M", "L", "XL"]
    },
    {
      title: "Gray Pattern Tshirt",
      cat: "Women",
      price: "$30.00 - $34.00",
      image: "images/tshirt7-300x300.jpg",
      dots: ["cyan", "blue", "green", "yellow", "purple"]
    }
  ],
  2: [
    {
      title: "Lemons Tshirt",
      cat: "Women",
      price: "$25.00 - $28.00",
      image: "images/tshirt2-300x300.jpg",
      imageFilter: "hue-rotate(62deg) saturate(1.18)",
      imageBoxBg: "#afc4ee",
      dots: ["blue", "green"],
      sizes: ["M", "L"],
      quickAdd: true
    },
    {
      title: "Light Brown Purse",
      cat: "Accessories",
      price: "$150.00",
      image: "images/product-bag1-300x300.jpg"
    },
    {
      title: "Purple Tshirt",
      cat: "Women",
      price: "$25.00 - $27.00",
      image: "images/tshirt2-300x300.jpg",
      imageFilter: "hue-rotate(155deg) saturate(1.12)",
      imageBoxBg: "#b4b0e5",
      dots: ["blue", "green", "yellow"]
    },
    {
      title: "Slim Fit Blue Jeans",
      cat: "Women",
      price: "$150.00",
      image: "images/product-m-jeans2-300x300.jpg"
    },
    {
      title: "White Underground Tshirt",
      cat: "Women",
      price: "$150.00",
      image: "images/tshirt2-300x300.jpg",
      imageBoxBg: "#afc4ee"
    }
  ]
};

const pageMeta = {
  1: {
    crumb: "Home / Women",
    results: "Showing 1-12 of 17 results",
    description:
      "Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit sed ut."
  },
  2: {
    crumb: "Home / Women / Page 2",
    results: "Showing 13-17 of 17 results",
    description: ""
  }
};

const grid = document.getElementById("product-grid");
const crumb = document.getElementById("store-crumb");
const results = document.getElementById("store-results");
const description = document.getElementById("store-description");
const pageButtons = Array.from(document.querySelectorAll(".page-number"));
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");

let currentPage = 1;

function renderPrice(item) {
  if (!item.oldPrice) return item.price;
  return `<span>${item.oldPrice}</span>${item.price}`;
}

function renderDots(item) {
  if (!item.dots || item.dots.length === 0) return "";
  const dotHtml = item.dots.map((dot) => `<span class="dot ${dot}"></span>`).join("");
  return `<p class="dots">${dotHtml}</p>`;
}

function renderSizes(item) {
  if (!item.sizes || item.sizes.length === 0) return "";
  const sizeHtml = item.sizes.map((size) => `<span class="size-chip">${size}</span>`).join("");
  return `<p class="size-options">${sizeHtml}</p>`;
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

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderCard(item) {
  const imageStyle = item.imageFilter ? ` style="filter:${item.imageFilter}"` : "";
  const productUrl = buildProductUrl(item);

  return `
    <article class="product-card">
      <a class="product-link" href="${productUrl}">
        <div class="product-img">
          ${item.sale ? '<span class="sale-badge">Sale!</span>' : ""}
          <button class="add-to-cart-btn" type="button" data-product-title="${escapeAttr(item.title)}" data-product-cat="${escapeAttr(item.cat)}" data-product-image="${escapeAttr(item.image)}" data-product-price="${escapeAttr(item.price)}" aria-label="Add to cart"><span class="add-tip">Add to cart</span><i class="bi bi-bag-fill"></i></button>
          <img src="${item.image}" alt="${item.title}"${imageStyle}>
        </div>
      </a>
      <h3><a class="product-link" href="${productUrl}">${item.title}</a></h3>
      <p class="cat">${item.cat}</p>
      <p class="price">${renderPrice(item)}</p>
      ${renderDots(item)}
      ${renderSizes(item)}
    </article>
  `;
}

function updatePagination(page) {
  pageButtons.forEach((btn) => {
    const btnPage = Number(btn.dataset.page);
    btn.classList.toggle("active", btnPage === page);
  });

  prevBtn.style.display = page === 1 ? "none" : "inline-flex";
  nextBtn.style.display = page === 2 ? "none" : "inline-flex";
}

function setPage(page) {
  if (!productsByPage[page]) return;

  currentPage = page;
  const list = productsByPage[page];
  const meta = pageMeta[page];

  crumb.textContent = meta.crumb;
  results.textContent = meta.results;
  description.textContent = meta.description;
  description.style.display = meta.description ? "block" : "none";

  grid.innerHTML = list.map(renderCard).join("");
  updatePagination(page);
}

pageButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setPage(Number(btn.dataset.page));
  });
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) setPage(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
  if (currentPage < 2) setPage(currentPage + 1);
});

setPage(1);

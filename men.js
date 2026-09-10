const productsByPage = {
  1: [
    {
      title: "Black Hoodie",
      cat: "Men",
      price: "$150.00",
      image: "images/product-hoodie1-300x300.jpg"
    },
    {
      title: "Blue Hoodie",
      cat: "Men",
      price: "$150.00",
      image: "images/product-hoodie2-300x300.jpg"
    },
    {
      title: "Blue Tshirt",
      cat: "Men",
      price: "$40.00",
      image: "images/tshirt2-300x300.jpg",
      dots: ["cyan", "blue", "green", "orange"]
    },
    {
      title: "Dark Blue Denim Jeans",
      cat: "Men",
      price: "$150.00",
      image: "images/product-m-jeans2-300x300.jpg"
    },
    {
      title: "Dark Brown Jeans",
      cat: "Men",
      price: "$150.00",
      image: "images/product-m-jeans1-300x300.jpg"
    },
    {
      title: "Dark Gray Jeans",
      cat: "Men",
      price: "$150.00",
      image: "images/product-m-jeans4-300x300.jpg"
    },
    {
      title: "DNK Blue Shoes",
      cat: "Men",
      price: "$200.00 - $240.00",
      image: "images/sports-shoe1-300x300.jpg",
      imageFilter: "hue-rotate(18deg) saturate(1.1)",
      dots: ["blue", "green", "orange"]
    },
    {
      title: "DNK Green Shoes",
      cat: "Men",
      price: "$250.00 - $290.00",
      image: "images/sports-shoe3-300x300.jpg",
      imageFilter: "hue-rotate(10deg) saturate(1.08)",
      dots: ["cyan", "blue", "green", "orange"]
    },
    {
      title: "DNK Green Tshirt",
      cat: "Men",
      price: "$42.00",
      image: "images/tshirt2-300x300.jpg",
      imageFilter: "hue-rotate(38deg) saturate(1.15)",
      dots: ["cyan", "blue", "green", "yellow"]
    },
    {
      title: "DNK Red Shoes",
      cat: "Men",
      price: "$150.00",
      image: "images/sports-shoe1-300x300.jpg",
      imageFilter: "hue-rotate(115deg) saturate(1.15)"
    },
    {
      title: "DNK Yellow Shoes",
      cat: "Men",
      price: "$120.00",
      oldPrice: "$150.00",
      sale: true,
      image: "images/sports-shoe3-300x300.jpg",
      imageFilter: "hue-rotate(52deg) saturate(1.1) brightness(1.03)"
    },
    {
      title: "Faint Washed Denim Blue Jeans",
      cat: "Men",
      price: "$150.00",
      image: "images/product-m-jeans2-300x300.jpg",
      imageFilter: "hue-rotate(165deg) saturate(0.95) brightness(1.04)"
    }
  ],
  2: [
    {
      title: "Green Hoodie",
      cat: "Men",
      price: "$150.00",
      image: "images/product-hoodie2-300x300.jpg",
      imageFilter: "hue-rotate(240deg) saturate(1.18)"
    },
    {
      title: "Red Hoodie",
      cat: "Men",
      price: "$150.00",
      image: "images/product-hoodie2-300x300.jpg",
      imageFilter: "hue-rotate(145deg) saturate(1.35) brightness(1.04)"
    }
  ]
};

const pageMeta = {
  1: {
    crumb: "Home / Men",
    results: "Showing 1-12 of 14 results",
    description:
      "Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit sed ut."
  },
  2: {
    crumb: "Home / Men / Page 2",
    results: "Showing 13-14 of 14 results",
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

(function () {
  const KEY = "brandstore_customizer_v1";

  const fontOptions = [
    { name: "Lato", css: "Lato, sans-serif" },
    { name: "Poppins", css: "Poppins, sans-serif" },
    { name: "Montserrat", css: "Montserrat, sans-serif" },
    { name: "Merriweather", css: "Merriweather, serif" },
    { name: "Nunito", css: "Nunito, sans-serif" },
    { name: "Roboto", css: "Roboto, sans-serif" },
    { name: "Open Sans", css: "Open Sans, sans-serif" },
    { name: "Playfair", css: "Playfair Display, serif" },
    { name: "Oswald", css: "Oswald, sans-serif" }
  ];

  const colorOptions = [
    ["#1692d4", "#1f78c8"],
    ["#1e64d9", "#245ad3"],
    ["#57aa3d", "#2f8a34"],
    ["#db123d", "#c70835"],
    ["#ea58a9", "#db3d99"],
    ["#f97316", "#f35f00"],
    ["#6d28d9", "#5b21b6"],
    ["#f59e0b", "#e18900"],
    ["#169c88", "#0e8a77"],
    ["#d39a3b", "#c58b2a"],
    ["#3ea1b8", "#2a8ea6"]
  ];

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveSettings(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function applySettings(settings) {
    if (settings.fontCss) {
      document.body.style.fontFamily = settings.fontCss;
      document.querySelectorAll("button,input,select,textarea").forEach((el) => {
        el.style.fontFamily = settings.fontCss;
      });
    }
    if (settings.accent) {
      document.documentElement.style.setProperty("--custom-accent", settings.accent);
    }
  }

  function init() {
    const trigger = document.querySelector(".customize-float");
    if (!trigger) return;

    const panel = document.createElement("aside");
    panel.className = "customizer-panel";
    panel.innerHTML = `
      <div class="customizer-head">
        <h3>Brandstore</h3>
        <button class="customizer-close" type="button" aria-label="Close">×</button>
      </div>
      <div class="customizer-body">
        <p class="customizer-copy">Use the template as-is or try different colors and fonts from the options below.</p>

        <h4 class="customizer-title">Try Other Fonts</h4>
        <div class="font-grid" id="font-grid"></div>

        <h4 class="customizer-title">Try Other Colors</h4>
        <div class="color-grid" id="color-grid"></div>
      </div>
    `;

    document.body.appendChild(panel);

    const settings = readSettings();
    applySettings(settings);

    const fontGrid = panel.querySelector("#font-grid");
    const colorGrid = panel.querySelector("#color-grid");

    fontGrid.innerHTML = fontOptions
      .map((font, idx) => `<button class="font-choice ${settings.fontCss === font.css || (!settings.fontCss && idx === 0) ? "active" : ""}" data-font-css="${font.css}" title="${font.name}" type="button">Aa</button>`)
      .join("");

    colorGrid.innerHTML = colorOptions
      .map((pair) => {
        const accent = pair[0];
        const active = settings.accent === accent ? "active" : "";
        return `<button class="color-choice ${active}" data-accent="${accent}" type="button"><span style="background:${pair[0]}"></span><span style="background:${pair[1]}"></span></button>`;
      })
      .join("");

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("customizer-open");
    });

    panel.querySelector(".customizer-close").addEventListener("click", () => {
      document.body.classList.remove("customizer-open");
    });

    panel.addEventListener("click", (event) => {
      const fontBtn = event.target.closest(".font-choice");
      if (fontBtn) {
        const next = { ...readSettings(), fontCss: fontBtn.dataset.fontCss };
        saveSettings(next);
        applySettings(next);
        panel.querySelectorAll(".font-choice").forEach((el) => el.classList.remove("active"));
        fontBtn.classList.add("active");
      }

      const colorBtn = event.target.closest(".color-choice");
      if (colorBtn) {
        const next = { ...readSettings(), accent: colorBtn.dataset.accent };
        saveSettings(next);
        applySettings(next);
        panel.querySelectorAll(".color-choice").forEach((el) => el.classList.remove("active"));
        colorBtn.classList.add("active");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

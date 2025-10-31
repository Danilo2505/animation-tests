// ----- Font Manager -----
const FontManager = {
  defineCurrentFont(font, btnFontToggle) {
    const defaultContent = `<span style='font-family: "Quicksand", sans-serif;'>A</span>`;
    const playfairContent = `<span style='font-family: "Playfair Display", serif;'>A</span>`;
    const segoeUIContent = `<span style='font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;'>A</span>`;

    document.documentElement.setAttribute("data-font", font);

    if (btnFontToggle) {
      if (font === "playfair") btnFontToggle.innerHTML = playfairContent;
      else if (font === "segoeUI") btnFontToggle.innerHTML = segoeUIContent;
      else btnFontToggle.innerHTML = defaultContent;
    }
  },

  toggleFont(btnFontToggle) {
    const fonts = ["default", "playfair", "segoeUI"];
    const current = localStorage.getItem("fontSystem") || "default";
    const next = fonts[(fonts.indexOf(current) + 1) % fonts.length];
    localStorage.setItem("fontSystem", next);
    this.defineCurrentFont(next, btnFontToggle);
  },

  init(btnFontToggle) {
    const saved = localStorage.getItem("fontSystem") || "default";
    this.defineCurrentFont(saved, btnFontToggle);
  },
};

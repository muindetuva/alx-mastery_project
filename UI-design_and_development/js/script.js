const root = document.documentElement;
const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
const themeToggle = document.querySelector("#themeToggle");

function applyTheme(theme) {
  const darkMode = theme === "dark";
  root.classList.toggle("dark", darkMode);
  themeToggle.setAttribute(
    "aria-label",
    darkMode ? "Switch to light theme" : "Switch to dark theme"
  );
}

applyTheme(localStorage.getItem("theme") || "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = root.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", nextTheme);
  applyTheme(nextTheme);
});

menuToggle.addEventListener("click", () => {
  const opening = mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden");
  menuToggle.setAttribute("aria-expanded", String(opening));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

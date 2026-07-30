const body = document.body;
const menuToggle = document.querySelector("#menuToggle");
const primaryNav = document.querySelector("#primaryNav");
const scrollTopButton = document.querySelector("#scrollTop");
const themeToggle = document.querySelector("#themeToggle");
const tagFilter = document.querySelector("#tagFilter");
const projectsSection = document.querySelector("#projects");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

let projects = [];

function setTheme(theme) {
  const isDark = theme === "dark";
  body.classList.toggle("dark-theme", isDark);
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
}

setTheme(localStorage.getItem("theme") || "light");

themeToggle.addEventListener("click", () => {
  const theme = body.classList.toggle("dark-theme") ? "dark" : "light";
  localStorage.setItem("theme", theme);
  setTheme(theme);
});

menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    primaryNav.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function updateActiveNavigation() {
  const sections = document.querySelectorAll("main > section[id]");
  let currentId = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 180) {
      currentId = section.id;
    }
  });
  document.querySelectorAll("#primaryNav a").forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${currentId}`
    );
  });
}

function renderProjects(selectedTag = "All") {
  projectsSection.querySelectorAll(".project-card").forEach((card) => {
    card.remove();
  });
  const fragment = document.createDocumentFragment();
  projects
    .filter((project) => (
      selectedTag === "All" || project.tags.includes(selectedTag)
    ))
    .forEach((project) => {
      const article = document.createElement("article");
      article.className = "project-card";

      const heading = document.createElement("h3");
      heading.textContent = project.title;
      const description = document.createElement("p");
      description.textContent = project.description;
      const tags = document.createElement("p");
      tags.className = "tags";

      project.tags.forEach((tagName) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagName;
        tags.append(tag);
      });

      const link = document.createElement("a");
      link.href = project.link;
      link.textContent = `View ${project.title} source code`;

      article.append(heading, description, tags, link);
      fragment.append(article);
    });
  projectsSection.append(fragment);
}

function populateTagFilter() {
  const tags = new Set(projects.flatMap((project) => project.tags));
  const fragment = document.createDocumentFragment();
  [...tags].sort().forEach((tagName) => {
    const option = document.createElement("option");
    option.value = tagName;
    option.textContent = tagName;
    fragment.append(option);
  });
  tagFilter.append(fragment);
}

fetch("data/projects.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Project data could not be loaded.");
    }
    return response.json();
  })
  .then((data) => {
    projects = data;
    populateTagFilter();
    renderProjects();
  })
  .catch((error) => {
    const message = document.createElement("p");
    message.className = "form-status error";
    message.textContent = error.message;
    projectsSection.append(message);
  });

tagFilter.addEventListener("change", () => {
  renderProjects(tagFilter.value);
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  formStatus.className = "form-status";
  if (!name || !email || !message) {
    formStatus.classList.add("error");
    formStatus.textContent = "Please complete every field before submitting.";
    return;
  }
  if (!emailIsValid) {
    formStatus.classList.add("error");
    formStatus.textContent = "Please enter a valid email address.";
    return;
  }

  formStatus.classList.add("success");
  formStatus.textContent = `Thank you, ${name}. Your message is ready to send.`;
  contactForm.reset();
});

window.addEventListener("scroll", () => {
  scrollTopButton.classList.toggle("visible", window.scrollY > 300);
  updateActiveNavigation();
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateActiveNavigation();

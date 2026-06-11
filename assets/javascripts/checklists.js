(function () {
  const STORAGE_PREFIX = "hacking-notes-checklist";

  function normalizeText(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function initChecklists() {
    const checkboxes = document.querySelectorAll(".md-content input[type='checkbox']");

    checkboxes.forEach((checkbox, index) => {
      const page = window.location.pathname;
      const label = checkbox.closest("li") ? normalizeText(checkbox.closest("li").innerText) : `checkbox-${index}`;
      const key = `${STORAGE_PREFIX}:${page}:${index}:${label}`;

      const savedValue = localStorage.getItem(key);

      if (savedValue !== null) {
        checkbox.checked = savedValue === "true";
      }

      checkbox.addEventListener("change", () => {
        localStorage.setItem(key, checkbox.checked ? "true" : "false");
      });
    });
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(() => {
      initChecklists();
    });
  } else {
    document.addEventListener("DOMContentLoaded", initChecklists);
  }
})();
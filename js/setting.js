const DARK_MODE_KEY = "xinnlab_dark_mode";
const LANGUAGE_KEY = "xinnlab_language";

function loadSettings() {
  const darkMode = localStorage.getItem(DARK_MODE_KEY) === "true";
  const language = localStorage.getItem(LANGUAGE_KEY) || "English";

  document.getElementById("dark-toggle").checked = darkMode;
  document.getElementById("language").value = language;

  applyDarkMode(darkMode);
}

function toggleDarkMode() {
  const enabled = document.getElementById("dark-toggle").checked;
  localStorage.setItem(DARK_MODE_KEY, enabled);
  applyDarkMode(enabled);
}

function applyDarkMode(enabled) {
  if (enabled) {
    document.body.style.backgroundColor = "#121212";
    document.body.style.color = "#eee";
  } else {
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
  }
}

function logout() {
  localStorage.removeItem("xinnlab_logged_in_user");
  window.location.href = "login.html";
}

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

// js/settings.js

function deleteAccount() {
  const username = localStorage.getItem("xinnlab_logged_in_user");
  if (!confirm("Are you sure you want to delete your account?")) return;

  let accounts = JSON.parse(localStorage.getItem("xinnlab_accounts") || "[]");
  accounts = accounts.filter(u => u.username !== username);

  // Also remove from others' friends and requests
  accounts.forEach(u => {
    u.friends = u.friends.filter(f => f !== username);
    u.friendRequestsSent = u.friendRequestsSent.filter(f => f !== username);
    u.friendRequestsReceived = u.friendRequestsReceived.filter(f => f !== username);
  });

  localStorage.setItem("xinnlab_accounts", JSON.stringify(accounts));
  localStorage.removeItem("xinnlab_logged_in_user");

  alert("Account deleted.");
  window.location.href = "register.html";
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

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

// js/settings.js

function deleteAccount() {
  const username = localStorage.getItem("xinnlab_logged_in_user");

  if (!username) {
    alert("No logged-in user.");
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to delete your account (${username})?`);
  if (!confirmDelete) return;

  let accounts = JSON.parse(localStorage.getItem("xinnlab_accounts") || "[]");

  // Remove user from main list
  accounts = accounts.filter(acc => acc.username !== username);

  // Also remove user from others' records
  accounts.forEach(acc => {
    acc.friends = acc.friends.filter(f => f !== username);
    acc.friendRequestsSent = acc.friendRequestsSent.filter(r => r !== username);
    acc.friendRequestsReceived = acc.friendRequestsReceived.filter(r => r !== username);
  });

  // Save updated accounts list
  localStorage.setItem("xinnlab_accounts", JSON.stringify(accounts));

  // Clear session and redirect
  localStorage.removeItem("xinnlab_logged_in_user");
  alert("✅ Account deleted.");
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

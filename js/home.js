const LOGGED_IN_USER = "xinnlab_logged_in_user";
const ACCOUNTS_KEY = "xinnlab_accounts";

function getAccounts() {
  const accountsJson = localStorage.getItem(ACCOUNTS_KEY);
  return accountsJson ? JSON.parse(accountsJson) : [];
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function logout() {
  localStorage.removeItem(LOGGED_IN_USER);
  window.location.href = "login.html";
}

// === Profile Load and Edit Functions ===

function loadProfile() {
  const username = localStorage.getItem(LOGGED_IN_USER);
  if (!username) {
    window.location.href = "login.html";
    return;
  }
  const accounts = getAccounts();
  const user = accounts.find(acc => acc.username === username);
  if (!user) {
    alert("User not found.");
    logout();
    return;
  }

  // Display view mode
  document.getElementById("profile-avatar").src = user.avatar;
  document.getElementById("profile-username").innerText = user.username;
  document.getElementById("profile-bio").innerText = user.bio;
  document.getElementById("profile-birth").innerText = user.birthdate;
  document.getElementById("profile-email").innerText = user.email;

  // Fill edit fields (for editing)
  document.getElementById("edit-avatar").value = user.avatar;
  document.getElementById("edit-bio").value = user.bio;
  document.getElementById("edit-birth").value = (user.birthdate && user.birthdate !== "Unknown") ? user.birthdate : "";
  document.getElementById("edit-email").value = user.email;
}

function enableEditProfile() {
  document.getElementById("profile-view").style.display = "none";
  document.getElementById("profile-edit").style.display = "block";
  document.getElementById("edit-profile-btn").style.display = "none";
  document.getElementById("save-profile-btn").style.display = "inline-block";
  document.getElementById("cancel-profile-btn").style.display = "inline-block";
}

function cancelEditProfile() {
  document.getElementById("profile-view").style.display = "block";
  document.getElementById("profile-edit").style.display = "none";
  document.getElementById("edit-profile-btn").style.display = "inline-block";
  document.getElementById("save-profile-btn").style.display = "none";
  document.getElementById("cancel-profile-btn").style.display = "none";

  loadProfile();
}

function saveProfile() {
  const avatar = document.getElementById("edit-avatar").value.trim();
  const bio = document.getElementById("edit-bio").value.trim();
  const birthdate = document.getElementById("edit-birth").value.trim() || "Unknown";
  const email = document.getElementById("edit-email").value.trim();

  if (!avatar || !bio || !email) {
    alert("Avatar URL, Bio, and Email cannot be empty.");
    return;
  }

  const username = localStorage.getItem(LOGGED_IN_USER);
  const accounts = getAccounts();
  const userIndex = accounts.findIndex(acc => acc.username === username);
  if (userIndex === -1) {
    alert("User not found.");
    logout();
    return;
  }

  accounts[userIndex].avatar = avatar;
  accounts[userIndex].bio = bio;
  accounts[userIndex].birthdate = birthdate;
  accounts[userIndex].email = email;

  saveAccounts(accounts);
  alert("Profile updated successfully!");

  cancelEditProfile(); // back to view mode updated
  loadProfile();
}

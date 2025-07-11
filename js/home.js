const LOGGED_IN_USER = "xinnlab_logged_in_user";
const ACCOUNTS_KEY = "xinnlab_accounts";

window.onload = () => {
  const username = localStorage.getItem(LOGGED_IN_USER);
  if (!username) {
    window.location.href = "login.html";
    return;
  }
  loadUserProfile(username);
};

function getAccounts() {
  const accountsJson = localStorage.getItem(ACCOUNTS_KEY);
  return accountsJson ? JSON.parse(accountsJson) : [];
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadUserProfile(username) {
  const accounts = getAccounts();
  const user = accounts.find(acc => acc.username === username);
  if (!user) {
    alert("User not found, logging out.");
    logout();
    return;
  }

  // If on profile page (profile.html), populate profile info
  if (document.getElementById("profile-username")) {
    document.getElementById("profile-avatar").src = user.avatar;
    document.getElementById("profile-username").innerText = user.username;
    document.getElementById("profile-bio").innerText = user.bio;
    document.getElementById("profile-birth").innerText = user.birthdate;
    document.getElementById("profile-email").innerText = user.email;
  }

  // If on home.html (feed page), initialize feed
  if (document.getElementById("feed")) {
    clearFeed();
    const feed = document.getElementById("feed");
    // Example welcome post
    const welcomePost = document.createElement("div");
    welcomePost.className = "post";
    welcomePost.innerHTML = `
      <div class="post-header">
        <img src="${user.avatar}" class="avatar-sm" />
        <div class="post-user-info">
          <strong>${user.username}</strong><br />
          <small>${new Date().toLocaleString()} • 🌐 Public</small>
        </div>
      </div>
     

// LocalStorage key for accounts and logged-in user
const ACCOUNTS_KEY = "xinnlab_accounts";
const LOGGED_IN_USER = "xinnlab_logged_in_user";

window.onload = () => {
  checkLogin();
};

function checkLogin() {
  const username = localStorage.getItem(LOGGED_IN_USER);
  if (username) {
    showApp(username);
  } else {
    showLogin();
  }
}

/* --------- AUTH ----------- */

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const error = document.getElementById("login-error");
  error.innerText = "";

  if (!username || !password) {
    error.innerText = "Please enter username and password.";
    return;
  }

  const accounts = getAccounts();
  const user = accounts.find(acc => acc.username === username);

  if (!user) {
    error.innerText = "User not found.";
    return;
  }
  if (user.password !== password) {
    error.innerText = "Incorrect password.";
    return;
  }

  // Login success
  localStorage.setItem(LOGGED_IN_USER, username);
  showApp(username);
}

function register() {
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("register-confirm-password").value;
  const error = document.getElementById("register-error");
  error.innerText = "";

  if (!username || !password || !confirmPassword) {
    error.innerText = "All fields are required.";
    return;
  }
  if (password !== confirmPassword) {
    error.innerText = "Passwords do not match.";
    return;
  }

  const accounts = getAccounts();

  if (accounts.find(acc => acc.username === username)) {
    error.innerText = "Username already taken.";
    return;
  }

  // Create new user with default profile info
  const newUser = {
    username,
    password,
    bio: "New user bio",
    birthdate: "Unknown",
    email: `${username}@xinnlab.com`,
    avatar: `https://i.pravatar.cc/150?u=${username}`
  };

  accounts.push(newUser);
  saveAccounts(accounts);

  alert("Registration successful! Please login.");
  showLogin();
}

function logout() {
  localStorage.removeItem(LOGGED_IN_USER);
  clearFeed();
  showLogin();
}

/* --------- SHOW/HIDE PAGES ----------- */

function showLogin() {
  document.getElementById("login-page").classList.remove("hidden");
  document.getElementById("register-page").classList.add("hidden");
  document.getElementById("app").classList.add("hidden");
}

function showRegister() {
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("register-page").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
}

function showApp(username) {
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("register-page").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  loadUserProfile(username);
  showTab("feed");
}

/* --------- ACCOUNT STORAGE HELPERS ----------- */

function getAccounts() {
  const accountsJson = localStorage.getItem(ACCOUNTS_KEY);
  return accountsJson ? JSON.parse(accountsJson) : [];
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

/* --------- USER PROFILE & POSTS ----------- */

function loadUserProfile(username) {
  const accounts = getAccounts();
  const user = accounts.find(acc => acc.username === username);
  if (!user) return;

  // Profile tab update
  document.getElementById("profile-avatar").src = user.avatar;
  document.getElementById("profile-username").innerText = user.username;
  document.getElementById("profile-bio").innerText = user.bio;
  document.getElementById("profile-birth").innerText = user.birthdate;
  document.getElementById("profile-email").innerText = user.email;

  // Clear feed and show welcome post
  clearFeed();
  const feed = document.getElementById("feed");
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
    <div class="post-text">Welcome back, ${user.username}! 🎉</div>
  `;
  feed.appendChild(welcomePost);
}

function clearFeed() {
  document.getElementById("feed").innerHTML = "";
}

/* --------- EXISTING POST FUNCTIONS ----------- */

function createPost() {
  const textarea = document.querySelector("textarea");
  const feed = document.getElementById("feed");
  const content = textarea.value.trim();
  const visibility = document.getElementById("visibility").value;
  const username = localStorage.getItem(LOGGED_IN_USER);
  if (!username) {
    alert("You must be logged in to post!");
    return;
  }
  if (!content) return;

  const accounts = getAccounts();
  const user = accounts.find(acc => acc.username === username);
  if (!user) return;

  const time = new Date().toLocaleString();

  const post = document.createElement("div");
  post.className = "post";

  post.innerHTML = `
    <div class="post-header">
      <img src="${user.avatar}" class="avatar-sm" />
      <div class="post-user-info">
        <strong>${user.username}</strong><br />
        <small>${time} • ${visibility}</small>
      </div>
      <button class="edit-btn" onclick="editPost(this)">✏️</button>
    </div>
    <div class="post-text">${escapeHtml(content)}</div>
    <div class="post-actions">
      <span onclick="likePost(this)">❤️ <span class="like-count">0</span></span>
      <span onclick="toggleComment(this)">💬 Comment</span>
      <span onclick="sharePost('${content.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">📤 Share</span>
    </div>
    <div class="comment-box" style="display:none;">
      <input type="text" placeholder="Write a comment..." />
    </div>
  `;

  feed.prepend(post);
  textarea.value = "";
}

function likePost(el) {
  const countSpan = el.querySelector(".like-count");
  let count = parseInt(countSpan.innerText);
  count++;
  countSpan.innerText = count;
}

function toggleComment(el) {
  const commentBox = el.closest(".post").querySelector(".comment-box");
  commentBox.style.display = commentBox.style.display === "none" ? "block" : "none";
}

function sharePost(text) {
  if (navigator.share) {
    navigator.share({
      title: "Xinn Lab Post",
      text: text,
    });
  } else {
    alert("Share not supported on this browser.");
  }
}

function editPost(btn) {
  const postText = btn.closest(".post").querySelector(".post-text");
  const oldText = postText.innerText;
  const newText = prompt("Edit your post:", oldText);
  if (newText !== null && newText.trim() !== "") {
    postText.innerText = newText.trim();
  }
}

function showTab(tab) {
  const tabs = ["feed", "profile", "settings"];
  tabs.forEach((t) => {
    document.getElementById(`${t}-tab`).classList.add("hidden");
    document.querySelector(`.nav-item:nth-child(${tabs.indexOf(t) + 1})`).classList.remove("active");
  });
  document.getElementById(`${tab

// Replace these with your desired username/password
const VALID_USERNAME = "koaung";
const VALID_PASSWORD = "123456";

window.onload = () => {
  checkLogin();
};

function checkLogin() {
  const loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn === "true") {
    showApp();
  } else {
    showLogin();
  }
}

function login() {
  const usernameInput = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value;

  const errorMsg = document.getElementById("login-error");
  errorMsg.innerText = "";

  if (usernameInput === VALID_USERNAME && passwordInput === VALID_PASSWORD) {
    localStorage.setItem("loggedIn", "true");
    showApp();
  } else {
    errorMsg.innerText = "Invalid username or password!";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  showLogin();
}

function showLogin() {
  document.getElementById("login-page").classList.remove("hidden");
  document.getElementById("app").classList.add("hidden");
}

function showApp() {
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  showTab("feed"); // default to feed tab
}

/* -- Existing functions -- */

function createPost() {
  const textarea = document.querySelector("textarea");
  const feed = document.getElementById("feed");
  const content = textarea.value.trim();
  const visibility = document.getElementById("visibility").value;

  if (!content) return;

  const time = new Date().toLocaleString();

  const post = document.createElement("div");
  post.className = "post";

  post.innerHTML = `
    <div class="post-header">
      <img src="https://i.pravatar.cc/50?u=koaung" class="avatar-sm" />
      <div class="post-user-info">
        <strong>Ko Aung</strong><br />
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
  document.getElementById(`${tab}-tab`).classList.remove("hidden");
  document.querySelector(`.nav-item:nth-child(${tabs.indexOf(tab) + 1})`).classList.add("active");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Simple function to prevent HTML injection in posts
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

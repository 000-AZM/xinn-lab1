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

// Post-related functions

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("xinnlab_posts") || "[]");
  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(post => {
    addPostToFeed(post);
  });
}

function addPostToFeed(post) {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.id = "post-" + post.id;

  postDiv.style.border = "1px solid #ccc";
  postDiv.style.borderRadius = "10px";
  postDiv.style.padding = "15px";
  postDiv.style.marginBottom = "20px";
  postDiv.style.backgroundColor = "#fff";

  postDiv.innerHTML = `
    <div class="post-header" style="display:flex; align-items:center; gap:10px;">
      <img src="${post.avatar}" class="avatar-sm" style="border-radius: 50%; width:40px; height:40px;" />
      <div class="post-user-info" style="flex-grow:1;">
        <strong>${post.username}</strong><br />
        <small>${new Date(post.time).toLocaleString()} • ${post.visibility}</small>
      </div>
      <button class="edit-btn" onclick="editPost(${post.id})" title="Edit Post" style="cursor:pointer;">✏️</button>
    </div>
    <div class="post-text" id="post-text-${post.id}" style="margin-top: 10px;">${post.content}</div>
    <div class="post-actions" style="margin-top:10px; display:flex; gap: 15px; cursor:pointer;">
      <span onclick="likePost(${post.id})">❤️ ${post.likes}</span>
      <span>💬 Comment</span>
      <span>📤 Share</span>
    </div>
  `;

  feed.prepend(postDiv);
}

function createPost() {
  const content = document.getElementById("post-content").value.trim();
  const visibility = document.getElementById("visibility").value;
  if (!content) {
    alert("Post content cannot be empty.");
    return;
  }

  const username = localStorage.getItem(LOGGED_IN_USER);
  const accounts = getAccounts();
  const user = accounts.find(acc => acc.username === username);
  if (!user) {
    alert("User not found.");
    logout();
    return;
  }

  const newPost = {
    id: Date.now(),
    username: user.username,
    avatar: user.avatar,
    time: new Date().toISOString(),
    visibility,
    content,
    likes: 0,
    comments: []
  };

  let posts = JSON.parse(localStorage.getItem("xinnlab_posts") || "[]");
  posts.unshift(newPost);
  localStorage.setItem("xinnlab_posts", JSON.stringify(posts));

  addPostToFeed(newPost);

  document.getElementById("post-content").value = "";
  document.getElementById("visibility").value = "🌐 Public";
}

function likePost(postId) {
  let posts = JSON.parse(localStorage.getItem("xinnlab_posts") || "[]");
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex === -1) return;

  posts[postIndex].likes++;
  localStorage.setItem("xinnlab_posts", JSON.stringify(posts));

  const feedPost = document.getElementById("post-" + postId);
  if (feedPost) {
    const likeSpan = feedPost.querySelector(".post-actions span");
    if (likeSpan) {
      likeSpan.innerText = `❤️ ${posts[postIndex].likes}`;
    }
  }
}

function editPost(postId) {
  const postTextDiv = document.getElementById("post-text-" + postId);
  if (!postTextDiv) return;

  const currentContent = postTextDiv.innerText;
  const textarea = document.createElement("textarea");
  textarea.value = currentContent;
  textarea.style.width = "100%";
  textarea.style.height = "60px";

  const saveBtn = document.createElement("button");
  saveBtn.innerText = "Save";
  saveBtn.style.marginTop = "5px";

  saveBtn.onclick = () => {
    const newText = textarea.value.trim();
    if (!newText) {
      alert("Post content cannot be empty.");
      return;
    }

    let posts = JSON.parse(localStorage.getItem("xinnlab_posts") || "[]");
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    posts[postIndex].content = newText;
    localStorage.setItem("xinnlab_posts", JSON.stringify(posts));

    postTextDiv.innerText = newText;
    postTextDiv.style.display = "block";
    textarea.remove();
    saveBtn.remove();
  };

  postTextDiv.style.display = "none";
  postTextDiv.parentNode.insertBefore(textarea, postTextDiv);
  postTextDiv.parentNode.insertBefore(saveBtn, postTextDiv);
}

// Load logged-in user info to prefill posts or other UI
function loadProfileInfoForPost() {
  const username = localStorage.getItem(LOGGED_IN_USER);
  const accounts = getAccounts();
  const user = accounts.find(acc => acc.username === username);
  if (!user) {
    logout();
    return;
  }
  // You can use user.avatar or username anywhere needed in this page if you want
}

// === Search users ===

function searchUsers() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = "";

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a username to search.</p>";
    return;
  }

  const accounts = getAccounts();
  const matchedUsers = accounts.filter(acc => acc.username.toLowerCase().includes(query));

  if (matchedUsers.length === 0) {
    resultsDiv.innerHTML = `<p>No users found matching "<strong>${query}</strong>".</p>`;
    return;
  }

  matchedUsers.forEach(user => {
    const userDiv = document.createElement("div");
    userDiv.style.border = "1px solid #ccc";
    userDiv.style.borderRadius = "10px";
    userDiv.style.padding = "10px";
    userDiv.style.marginBottom = "10px";
    userDiv.style.display = "flex";
    userDiv.style.alignItems = "center";
    userDiv.style.gap = "10px";

    userDiv.innerHTML = `
      <img src="${user.avatar}" alt="${user.username} avatar" style="width:50px; height:50px; border-radius:50%;" />
      <div>
        <strong>${user.username}</strong><br />
        <small>${user.bio}</small>
      </div>
    `;

    resultsDiv.appendChild(userDiv);
  });
}

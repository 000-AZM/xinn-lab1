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
      <div class="post-text">Welcome to Xinn Lab Social App!</div>
      <div class="post-actions">
        <span>❤️ 0</span> <span>💬 Comment</span> <span>📤 Share</span>
      </div>
    `;
    feed.appendChild(welcomePost);

    // Load saved posts if any
    loadPosts();
  }
}

function logout() {
  localStorage.removeItem(LOGGED_IN_USER);
  window.location.href = "login.html";
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

  // Build post object
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

  // Save post to localStorage
  let posts = JSON.parse(localStorage.getItem("xinnlab_posts") || "[]");
  posts.unshift(newPost);
  localStorage.setItem("xinnlab_posts", JSON.stringify(posts));

  addPostToFeed(newPost);
  document.getElementById("post-content").value = "";
  document.getElementById("visibility").value = "🌐 Public";
}

function addPostToFeed(post) {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.id = "post-" + post.id;

  postDiv.innerHTML = `
    <div class="post-header">
      <img src="${post.avatar}" class="avatar-sm" />
      <div class="post-user-info">
        <strong>${post.username}</strong><br />
        <small>${new Date(post.time).toLocaleString()} • ${post.visibility}</small>
      </div>
      <button class="edit-btn" onclick="editPost(${post.id})" title="Edit Post">✏️</button>
    </div>
    <div class="post-text" id="post-text-${post.id}">${post.content}</div>
    <div class="post-actions">
      <span onclick="likePost(${post.id})">❤️ ${post.likes}</span>
      <span>💬 Comment</span>
      <span>📤 Share</span>
    </div>
  `;
  feed.prepend(postDiv);
}

function clearFeed() {
  const feed = document.getElementById("feed");
  if (feed) feed.innerHTML = "";
}

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("xinnlab_posts") || "[]");
  posts.forEach(post => {
    addPostToFeed(post);
  });
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

    // Update localStorage post
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

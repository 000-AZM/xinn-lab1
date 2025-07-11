function createPost() {
  const textarea = document.querySelector("textarea");
  const feed = document.getElementById("feed");
  const content = textarea.value.trim();
  if (!content) return;

  const post = document.createElement("div");
  post.className = "post";

  post.innerHTML = `
    <div class="post-text">${content}</div>
    <div class="post-actions">
      <span onclick="likePost(this)">❤️ <span class="like-count">0</span></span>
      <span onclick="toggleComment(this)">💬 Comment</span>
      <span onclick="sharePost('${content}')">📤 Share</span>
    </div>
    <div class="comment-box" style="display:none;">
      <input type="text" placeholder="Write a comment..." style="width:100%; padding:6px; margin-top:6px; border-radius:6px;" />
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

function showTab(tab) {
  const tabs = ["feed", "profile", "settings"];
  tabs.forEach(t => {
    document.getElementById(`${t}-tab`).classList.add("hidden");
    document.querySelector(`.nav-item:nth-child(${tabs.indexOf(t) + 1})`).classList.remove("active");
  });
  document.getElementById(`${tab}-tab`).classList.remove("hidden");
  document.querySelector(`.nav-item:nth-child(${tabs.indexOf(tab) + 1})`).classList.add("active");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

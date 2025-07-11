// script.js
function createPost() {
  const textarea = document.querySelector("textarea");
  const feed = document.getElementById("feed");

  const content = textarea.value.trim();
  if (!content) return;

  const post = document.createElement("div");
  post.className = "post";
  post.innerText = content;

  // Add new post to the top of the feed
  feed.insertBefore(post, feed.firstChild);

  // Clear textarea
  textarea.value = "";
}

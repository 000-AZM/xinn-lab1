// Post logic
function createPost() {
  const textarea = document.querySelector("textarea");
  const feed = document.getElementById("feed");

  const content = textarea.value.trim();
  if (!content) return;

  const post = document.createElement("div");
  post.className = "post";
  post.innerText = content;

  feed.prepend(post);
  textarea.value = "";
}

// Navigation tabs
function showTab(tab) {
  const tabs = ["feed", "profile", "settings"];
  tabs.forEach(t => {
    document.getElementById(`${t}-tab`).classList.add("hidden");
    document.querySelector(`.nav-item:nth-child(${tabs.indexOf(t) + 1})`).classList.remove("active");
  });

  document.getElementById(`${tab}-tab`).classList.remove("hidden");
  document.querySelector(`.nav-item:nth-child(${tabs.indexOf(tab) + 1})`).classList.add("active");
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

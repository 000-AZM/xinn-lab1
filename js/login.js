// js/login.js

document.getElementById("login-form").onsubmit = function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const msg = document.getElementById("login-msg");

  const accounts = JSON.parse(localStorage.getItem("xinnlab_accounts") || "[]");
  const user = accounts.find(u => u.email === email && u.password === password);

  if (!user) {
    msg.textContent = "❌ Invalid credentials.";
    return;
  }

  localStorage.setItem("xinnlab_logged_in_user", user.username);
  window.location.href = "profile.html";
};

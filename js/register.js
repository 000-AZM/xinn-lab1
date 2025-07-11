// js/register.js

const ACCOUNTS_KEY = "xinnlab_accounts";

function getAccounts() {
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

document.getElementById("register-form").onsubmit = function (e) {
  e.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const msg = document.getElementById("reg-msg");

  if (!email.endsWith("@xinn.lab")) {
    msg.textContent = "❌ Email must end with @xinn.lab";
    return;
  }

  const accounts = getAccounts();
  if (accounts.some(acc => acc.username === username || acc.email === email)) {
    msg.textContent = "❌ Username or email already exists.";
    return;
  }

  const newUser = {
    username,
    email,
    password,
    avatar: "",
    bio: "",
    friends: [],
    friendRequestsSent: [],
    friendRequestsReceived: []
  };

  accounts.push(newUser);
  saveAccounts(accounts);

  msg.textContent = "✅ Registered! You can log in.";
  document.getElementById("register-form").reset();
};

const ACCOUNTS_KEY = "xinnlab_accounts";

function getAccounts() {
  const accountsJson = localStorage.getItem(ACCOUNTS_KEY);
  return accountsJson ? JSON.parse(accountsJson) : [];
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

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

  localStorage.setItem("xinnlab_logged_in_user", username);
  window.location.href = "home.html";
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
  window.location.href = "login.html";
}

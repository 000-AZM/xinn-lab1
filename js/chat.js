const LOGGED_IN_USER = "xinnlab_logged_in_user";

function getChatKey(userA, userB) {
  return "chat_" + [userA, userB].sort().join("_");
}

function getAccounts() {
  const a = localStorage.getItem("xinnlab_accounts");
  return a ? JSON.parse(a) : [];
}

function saveAccounts(accounts) {
  localStorage.setItem("xinnlab_accounts", JSON.stringify(accounts));
}

function logout() {
  localStorage.removeItem(LOGGED_IN_USER);
  window.location.href = "login.html";
}

window.onload = function () {
  document.getElementById("logout-btn").onclick = logout;
  loadChatUI();
  document.getElementById("send-chat-btn").onclick = sendChatMessage;
};

let currentChatFriend = null;
let loggedInUser = null;

function loadChatUI() {
  loggedInUser = localStorage.getItem(LOGGED_IN_USER);
  currentChatFriend = localStorage.getItem("xinnlab_chat_with");

  if (!loggedInUser) {
    window.location.href = "login.html";
    return;
  }
  if (!currentChatFriend) {
    alert("No chat friend selected.");
    window.location.href = "profile.html";
    return;
  }

  document.getElementById("chat-friend-name").innerText = currentChatFriend;
  renderChatMessages();
}

function loadChatMessages() {
  const chatKey = getChatKey(loggedInUser, currentChatFriend);
  const chat = JSON.parse(localStorage.getItem(chatKey) || '{"messages":[]}');
  return chat.messages;
}

function saveChatMessages(messages) {
  const chatKey = getChatKey(loggedInUser, currentChatFriend);
  localStorage.setItem(chatKey, JSON.stringify({ messages }));
}

function renderChatMessages() {
  const messages = loadChatMessages();
  const chatDiv = document.getElementById("chat-messages");
  chatDiv.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message";
    if (msg.sender === loggedInUser) div.classList.add("you");

    div.innerHTML = `<strong>${msg.sender}</strong>: ${msg.text} <br/><small>${new Date(msg.time).toLocaleTimeString()}</small>`;
    chatDiv.appendChild(div);
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  const messages = loadChatMessages();
  messages.push({ sender: loggedInUser, text, time: new Date().toISOString() });
  saveChatMessages(messages);

  input.value = "";
  renderChatMessages();
}

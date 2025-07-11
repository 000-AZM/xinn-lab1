const LOGGED_IN_USER = "xinnlab_logged_in_user";
const ACCOUNTS_KEY = "xinnlab_accounts";

function getAccounts() {
  const a = localStorage.getItem(ACCOUNTS_KEY);
  return a ? JSON.parse(a) : [];
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function logout() {
  localStorage.removeItem(LOGGED_IN_USER);
  window.location.href = "login.html";
}

window.onload = function () {
  document.getElementById("logout-btn").onclick = logout;
  loadProfileAndFriends();
  document.getElementById("send-friend-request-btn").onclick = sendFriendRequestFromInput;
};

function loadProfileAndFriends() {
  const username = localStorage.getItem(LOGGED_IN_USER);
  if (!username) {
    window.location.href = "login.html";
    return;
  }

  const accounts = getAccounts();
  const user = accounts.find(u => u.username === username);
  if (!user) {
    alert("User not found.");
    logout();
    return;
  }

  // Display profile
  document.getElementById("profile-avatar").src = user.avatar || "https://via.placeholder.com/80";
  document.getElementById("profile-username").innerText = user.username;
  document.getElementById("profile-bio").innerText = user.bio || "No bio";

  // Initialize friend arrays if missing
  user.friends = user.friends || [];
  user.friendRequestsReceived = user.friendRequestsReceived || [];
  user.friendRequestsSent = user.friendRequestsSent || [];

  // Show friends
  const friendListEl = document.getElementById("friend-list");
  friendListEl.innerHTML = "";
  user.friends.forEach(friendName => {
    const friend = accounts.find(u => u.username === friendName);
    const li = document.createElement("li");
    li.className = "friend-item";

    li.innerHTML = `
      <img src="${friend?.avatar || 'https://via.placeholder.com/40'}" alt="${friendName}" class="friend-avatar" />
      <span>${friendName}</span>
      <button onclick="openChat('${friendName}')">Chat</button>
    `;
    friendListEl.appendChild(li);
  });

  // Show friend requests
  const requestsEl = document.getElementById("friend-requests-list");
  requestsEl.innerHTML = "";
  user.friendRequestsReceived.forEach(fromUsername => {
    const li = document.createElement("li");
    li.textContent = fromUsername + " ";

    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accept";
    acceptBtn.onclick = () => {
      acceptFriendRequest(fromUsername);
      loadProfileAndFriends();
    };

    const declineBtn = document.createElement("button");
    declineBtn.textContent = "Decline";
    declineBtn.onclick = () => {
      declineFriendRequest(fromUsername);
      loadProfileAndFriends();
    };

    li.appendChild(acceptBtn);
    li.appendChild(declineBtn);
    requestsEl.appendChild(li);
  });
}

function sendFriendRequestFromInput() {
  const toUsername = document.getElementById("add-friend-username").value.trim();
  if (!toUsername) {
    alert("Enter a username");
    return;
  }
  sendFriendRequest(toUsername);
  document.getElementById("add-friend-username").value = "";
  loadProfileAndFriends();
}

function sendFriendRequest(toUsername) {
  const accounts = getAccounts();
  const currentUsername = localStorage.getItem(LOGGED_IN_USER);
  if (currentUsername === toUsername) {
    alert("You cannot friend yourself!");
    return;
  }
  const fromUser = accounts.find(u => u.username === currentUsername);
  const toUser = accounts.find(u => u.username === toUsername);
  if (!toUser) {
    alert("User not found.");
    return;
  }

  fromUser.friends = fromUser.friends || [];
  fromUser.friendRequestsSent = fromUser.friendRequestsSent || [];
  fromUser.friendRequestsReceived = fromUser.friendRequestsReceived || [];

  toUser.friends = toUser.friends || [];
  toUser.friendRequestsSent = toUser.friendRequestsSent || [];
  toUser.friendRequestsReceived = toUser.friendRequestsReceived || [];

  if (fromUser.friends.includes(toUsername)) {
    alert("Already friends.");
    return;
  }
  if (fromUser.friendRequestsSent.includes(toUsername)) {
    alert("Friend request already sent.");
    return;
  }
  if (fromUser.friendRequestsReceived.includes(toUsername)) {
    alert(`User has sent you a friend request. You can accept it.`);
    return;
  }

  fromUser.friendRequestsSent.push(toUsername);
  toUser.friendRequestsReceived.push(currentUsername);
  saveAccounts(accounts);
  alert(`Friend request sent to ${toUsername}`);
}

function acceptFriendRequest(fromUsername) {
  const accounts = getAccounts();
  const currentUsername = localStorage.getItem(LOGGED_IN_USER);
  const currentUser = accounts.find(u => u.username === currentUsername);
  const fromUser = accounts.find(u => u.username === fromUsername);
  if (!fromUser || !currentUser) return;

  currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(u => u !== fromUsername);
  fromUser.friendRequestsSent = fromUser.friendRequestsSent.filter(u => u !== currentUsername);

  currentUser.friends = currentUser.friends || [];
  fromUser.friends = fromUser.friends || [];

  if (!currentUser.friends.includes(fromUsername)) currentUser.friends.push(fromUsername);
  if (!fromUser.friends.includes(currentUsername)) fromUser.friends.push(currentUsername);

  saveAccounts(accounts);
  alert(`You are now friends with ${fromUsername}`);
}

function declineFriendRequest(fromUsername) {
  const accounts = getAccounts();
  const currentUsername = localStorage.getItem(LOGGED_IN_USER);
  const currentUser = accounts.find(u => u.username === currentUsername);
  const fromUser = accounts.find(u => u.username === fromUsername);
  if (!fromUser || !currentUser) return;

  currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(u => u !== fromUsername);
  fromUser.friendRequestsSent = fromUser.friendRequestsSent.filter(u => u !== currentUsername);

  saveAccounts(accounts);
  alert(`Friend request from ${fromUsername} declined.`);
}

function openChat(friendUsername) {
  // Save friend to chat with in localStorage and navigate to chat.html
  localStorage.setItem("xinnlab_chat_with", friendUsername);
  window.location.href = "chat.html";
}

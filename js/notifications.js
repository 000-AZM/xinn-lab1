const db = firebase.firestore();
const auth = firebase.auth();

let currentUser;
let currentUid;

auth.onAuthStateChanged(user => {
  if (!user) return;
  currentUser = user;
  currentUid = user.uid;
});

async function loadNotifications() {
  await loadFriendRequests();
  await loadComments();
}

async function loadFriendRequests() {
  try {
    const userDoc = await db.collection("users").doc(currentUid).get();
    const data = userDoc.data();
    const received = data.friendRequestsReceived || [];
    const list = document.getElementById("friend-req-list");
    list.innerHTML = "";

    if (received.length === 0) {
      list.textContent = "No friend requests.";
      return;
    }

    const fragment = document.createDocumentFragment();

    for (const senderId of received) {
      const senderDoc = await db.collection("users").doc(senderId).get();
      const senderName = senderDoc.data().username || "Someone";

      const div = document.createElement("div");
      div.className = "notification";
      div.innerHTML = `
        <span>${senderName} sent you a friend request</span>
        <div>
          <button class="accept-btn">Accept</button>
          <button class="reject-btn btn-danger">Reject</button>
        </div>
      `;

      div.querySelector(".accept-btn").onclick = async () => {
        await handleFriendRequestResponse(senderId, true, div);
      };
      div.querySelector(".reject-btn").onclick = async () => {
        await handleFriendRequestResponse(senderId, false, div);
      };

      fragment.appendChild(div);
    }

    list.appendChild(fragment);
  } catch (error) {
    console.error("Failed loading friend requests:", error);
    alert("Error loading friend requests.");
  }
}

async function handleFriendRequestResponse(senderId, accept, notificationDiv) {
  const buttons = notificationDiv.querySelectorAll("button");
  buttons.forEach(btn => (btn.disabled = true));

  try {
    const userRef = db.collection("users").doc(currentUid);
    const senderRef = db.collection("users").doc(senderId);

    const [userDoc, senderDoc] = await Promise.all([userRef.get(), senderRef.get()]);
    const userData = userDoc.data();
    const senderData = senderDoc.data();

    if (accept) {
      const userFriends = new Set(userData.friends || []);
      const senderFriends = new Set(senderData.friends || []);

      userFriends.add(senderId);
      senderFriends.add(currentUid);

      const newReceived = (userData.friendRequestsReceived || []).filter(id => id !== senderId);
      const newSent = (senderData.friendRequestsSent || []).filter(id => id !== currentUid);

      await Promise.all([
        userRef.update({
          friends: Array.from(userFriends),
          friendRequestsReceived: newReceived
        }),
        senderRef.update({
          friends: Array.from(senderFriends),
          friendRequestsSent: newSent
        }),
      ]);

      alert("Friend request accepted.");
    } else {
      const newReceived = (userData.friendRequestsReceived || []).filter(id => id !== senderId);
      const newSent = (senderData.friendRequestsSent || []).filter(id => id !== currentUid);

      await Promise.all([
        userRef.update({ friendRequestsReceived: newReceived }),
        senderRef.update({ friendRequestsSent: newSent }),
      ]);

      alert("Friend request rejected.");
    }

    notificationDiv.remove();

    const list = document.getElementById("friend-req-list");
    if (list.children.length === 0) {
      list.textContent = "No friend requests.";
    }
  } catch (error) {
    console.error("Error processing friend request:", error);
    alert("Failed to process friend request, please try again.");
    buttons.forEach(btn => (btn.disabled = false));
  }
}

async function loadComments() {
  try {
    const postsSnap = await db.collection("posts").where("uid", "==", currentUid).get();
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "";

    if (postsSnap.empty) {
      commentsList.textContent = "No comments on your posts.";
      return;
    }

    const fragment = document.createDocumentFragment();

    for (const postDoc of postsSnap.docs) {
      const postData = postDoc.data();
      if (!postData.comments || postData.comments.length === 0) continue;

      postData.comments.forEach(comment => {
        const div = document.createElement("div");
        div.className = "notification";
        div.textContent = comment;
        fragment.appendChild(div);
      });
    }

    if (fragment.childNodes.length === 0) {
      commentsList.textContent = "No comments on your posts.";
      return;
    }

    commentsList.appendChild(fragment);
  } catch (error) {
    console.error("Error loading comments:", error);
    alert("Failed to load comments.");
  }
}

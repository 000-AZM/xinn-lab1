async function checkSystemUpdate() {
  try {
    const doc = await firebase.firestore().collection("config").doc("systemStatus").get();
    if (doc.exists && doc.data().updating === 1) {
      document.body.innerHTML = `
        <h2 style="text-align:center; margin-top:2rem; color:#e74c3c;">
          ⚠️ System is updating, please come back later.
        </h2>`;
      return false;
    }
  } catch (e) {
    console.error("Update check error:", e);
  }
  return true;
}

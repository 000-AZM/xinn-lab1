<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Register</title>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
  <script src="js/firebase-config.js"></script>
  <style>
    body{font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;background:#f4f6f8}
    .container{background:white;padding:2rem;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);width:320px;text-align:center}
    input{width:100%;padding:0.6rem;margin:0.5rem 0;border:1px solid #ccc;border-radius:4px}
    button{width:100%;padding:0.7rem;border:none;background:#4a90e2;color:white;border-radius:4px;cursor:pointer}
    button:hover{background:#357abd}
    #msg{min-height:1.2rem;margin-top:0.5rem;font-weight:600}
    .switch-link{margin-top:1rem;font-size:0.9rem;color:#555}
    .switch-link a{color:#4a90e2;text-decoration:none}
    .switch-link a:hover{text-decoration:underline}
  </style>
</head>
<body>
  <div class="container">
    <h1>Register</h1>
    <form id="form"><input id="username" placeholder="Username" required /><input id="email" type="email" placeholder="Email (must end @xinn.lab)" required /><input id="password" type="password" placeholder="Password (min 6)" required minlength="6" /><button type="submit">Register</button></form>
    <p id="msg"></p>
    <p class="switch-link">Already have an account? <a href="login.html">Login</a></p>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', async e => {
      e.preventDefault();
      const msg = document.getElementById('msg');
      msg.textContent = ''; msg.style.color = '';
      const u = form.username.value.trim(), em = form.email.value.trim(), pw = form.password.value;
      if (!em.endsWith('@xinn.lab')) { msg.textContent = 'Email must end with @xinn.lab'; return; }
      try {
        const uc = await auth.createUserWithEmailAndPassword(em, pw);
        await db.collection('users').doc(uc.user.uid).set({username:u, email:em, bio:'', avatar:'', friends:[], friendRequestsSent:[], friendRequestsReceived:[]});
        msg.style.color = 'green'; msg.textContent = 'Registered! Redirecting...'; setTimeout(()=>location.href='login.html',1500);
      } catch(ex){ msg.style.color='red'; msg.textContent = ex.message; }
    });
  </script>
</body>
</html>

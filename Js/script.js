// getting HTML elements
const nav = document.querySelector("nav"),
      toggleBtn = nav.querySelector(".toggle-btn");

  toggleBtn.addEventListener("click" , () =>{
    nav.classList.toggle("open");
  });

// js code to make draggable nav
function onDrag({movementY}) { //movementY gets mouse vertical value
  const navStyle = window.getComputedStyle(nav), //getting all css style of nav
        navTop = parseInt(navStyle.top), // getting nav top value & convert it into string
        navHeight = parseInt(navStyle.height), // getting nav height value & convert it into string
        windHeight = window.innerHeight; // getting window height

  nav.style.top = navTop > 0 ? `${navTop + movementY}px` : "1px";
  if(navTop > windHeight - navHeight){
    nav.style.top = `${windHeight - navHeight}px`;
  }
}

//this function will call when user click mouse's button and  move mouse on nav
nav.addEventListener("mousedown", () =>{
  nav.addEventListener("mousemove", onDrag);
});

//these function will call when user relase mouse button and leave mouse from nav
nav.addEventListener("mouseup", () =>{
  nav.removeEventListener("mousemove", onDrag);
});
nav.addEventListener("mouseleave", () =>{
  nav.removeEventListener("mousemove", onDrag);
});






    /* ---------- localStorage helpers ---------- */
    const LS_KEY = "users";
    const loadUsers = () => JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    const saveUsers = (obj) => localStorage.setItem(LS_KEY, JSON.stringify(obj));

    /* Initialize store if missing */
    if (!localStorage.getItem(LS_KEY)) saveUsers({});

    /* ---------- Eye (show/hide) toggles ---------- */
    document.querySelectorAll(".eye").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const sel = btn.getAttribute("data-toggle");
        const input = document.querySelector(sel);
        if(!input) return;
        input.type = input.type === "password" ? "text" : "password";
      });
    });

    /* ---------- Signup ---------- */
    const suEmail = document.getElementById("suEmail");
    const suPass = document.getElementById("suPass");
    const suConfirm = document.getElementById("suConfirm");
    const suStatus = document.getElementById("suStatus");

    function validateSignupPasswords(){
      const same = suPass.value === suConfirm.value && suPass.value.length>0;
      suPass.classList.toggle("ok", same);
      suConfirm.classList.toggle("ok", same);
      suPass.classList.toggle("error", !same && suConfirm.value.length>0);
      suConfirm.classList.toggle("error", !same && suConfirm.value.length>0);
      suStatus.textContent = same ? "✅ Passwords match" : (suConfirm.value.length? "❌ Passwords do not match" : "");
      suStatus.className = "hint " + (same ? "ok" : (suConfirm.value.length? "err": ""));
      return same;
    }
    suPass.addEventListener("input", validateSignupPasswords);
    suConfirm.addEventListener("input", validateSignupPasswords);

    document.getElementById("signupForm").addEventListener("submit", (e)=>{
      e.preventDefault();
      const users = loadUsers();
      const email = suEmail.value.trim().toLowerCase();

      if(!validateSignupPasswords()){
        suConfirm.focus();
        return;
      }
      if(users[email]){
        suStatus.textContent = "❌ User already exists. Please login.";
        suStatus.className = "hint err";
        suEmail.classList.add("error");
        return;
      }
      users[email] = suPass.value;
      saveUsers(users);

      suStatus.textContent = "✅ Signup successful! Please login.";
      suStatus.className = "hint ok";

      // switch to Login tab
      document.getElementById("tab-login").checked = true;
      document.getElementById("panel-login").style.display = "block";
      document.getElementById("panel-signup").style.display = "none";

      // reset fields
      suEmail.value = suPass.value = suConfirm.value = "";
      suEmail.classList.remove("error","ok");
      suPass.classList.remove("error","ok");
      suConfirm.classList.remove("error","ok");
    });

    /* ---------- Login ---------- */
    const loginForm = document.getElementById("loginForm");
    const loginEmail = document.getElementById("loginEmail");
    const loginPass = document.getElementById("loginPass");
    const loginPassField = document.getElementById("loginPassField");

    loginForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const users = loadUsers();
      const email = loginEmail.value.trim().toLowerCase();
      const stored = users[email];

      if(!stored){
        alert("User not found! Please sign up.");
        loginEmail.classList.add("error");
        setTimeout(()=>loginEmail.classList.remove("error"),600);
        return;
      }
      if(stored === loginPass.value){
        alert("Login successful 🎉");
        loginEmail.value = loginPass.value = "";
      }else{
        // Shake the password field
        loginPassField.classList.add("shake");
        setTimeout(()=>loginPassField.classList.remove("shake"),400);
        alert("Incorrect password!");
      }
    });

    /* ---------- Forgot Password ---------- */
    const fpEmail = document.getElementById("fpEmail");
    const fpStatus = document.getElementById("fpStatus");
    const newPassWrap = document.getElementById("newPassWrap");
    const fpNew = document.getElementById("fpNew");
    const fpResetBtn = document.getElementById("fpResetBtn");

    function checkFpEmailLive(){
      const users = loadUsers();
      const email = fpEmail.value.trim().toLowerCase();
      if(email.length===0){
        fpEmail.classList.remove("error","ok");
        fpStatus.textContent = ""; fpStatus.className="hint";
        newPassWrap.style.display="none";
        return;
      }
      if(users[email]){
        fpEmail.classList.remove("error"); fpEmail.classList.add("ok");
        fpStatus.textContent = "✅ Email found"; fpStatus.className="hint ok";
        newPassWrap.style.display="block";
      }else{
        fpEmail.classList.remove("ok"); fpEmail.classList.add("error");
        fpStatus.textContent = "❌ Email not registered"; fpStatus.className="hint err";
        newPassWrap.style.display="none";
      }
    }
    fpEmail.addEventListener("input", checkFpEmailLive);

    fpResetBtn.addEventListener("click", ()=>{
      const users = loadUsers();
      const email = fpEmail.value.trim().toLowerCase();
      if(!users[email]){
        checkFpEmailLive();
        return;
      }
      if(!fpNew.value.trim()){
        fpNew.classList.add("error");
        setTimeout(()=>fpNew.classList.remove("error"),600);
        return;
      }
      users[email] = fpNew.value.trim();
      saveUsers(users);
      alert("Password reset successful! Please login with your new password.");

      // reset UI
      fpEmail.value=""; fpNew.value="";
      newPassWrap.style.display="none";
      fpStatus.textContent=""; fpEmail.classList.remove("ok","error");

      // switch to Login tab
      document.getElementById("tab-login").checked = true;
      document.getElementById("panel-login").style.display = "block";
      document.getElementById("panel-signup").style.display = "none";
    });

    /* ---------- Keep panels in sync when tab clicks ---------- */
    document.getElementById("tab-login").addEventListener("change",()=>{
      document.getElementById("panel-login").style.display="block";
      document.getElementById("panel-signup").style.display="none";
    });
    document.getElementById("tab-signup").addEventListener("change",()=>{
      document.getElementById("panel-login").style.display="none";
      document.getElementById("panel-signup").style.display="block";
    });

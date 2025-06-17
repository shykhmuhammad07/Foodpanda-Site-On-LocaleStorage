const loginToggle = document.getElementById("login-toggle");
const signupToggle = document.getElementById("signup-toggle");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const userOptions = document.querySelectorAll(".user-option");
const notification = document.getElementById("notification");

let userType = "";

loginToggle.addEventListener("click", () => {
  loginToggle.classList.add("active");
  signupToggle.classList.remove("active");
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
});

signupToggle.addEventListener("click", () => {
  signupToggle.classList.add("active");
  loginToggle.classList.remove("active");
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
});

userOptions.forEach((option) => {
  option.addEventListener("click", () => {
    userOptions.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");
    userType = option.dataset.type;
  });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleLogin();
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSignup();
});

function handleLogin() {
  if (!userType) return showNotification("Please select user type");

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) return showNotification("Fill all fields");

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const existingUser = users.find(
    (user) =>
      user.email === email &&
      user.password === password &&
      user.userType === userType
  );

  if (!existingUser) return showNotification("Invalid credentials");

  localStorage.setItem("currentUser", JSON.stringify(existingUser));

  showNotification("Login successful! Redirecting...");

  setTimeout(() => {
    window.location.href =
      userType === "admin" ? "./admin.html" : "./customer.html";
  }, 1500);
}


function handleSignup() {
  if (!userType) return showNotification("Please select user type");

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (!name || !email || !password || !confirm)
    return showNotification("Fill all fields");

  if (password !== confirm) return showNotification("Passwords do not match");

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find((user) => user.email === email))
    return showNotification("Email already exists");

  users.push({ name, email, password, userType });
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify({ name, email, password, userType }));

  showNotification("Signup successful! Redirecting...");

  setTimeout(() => {
    window.location.href =
      userType === "admin" ? "./admin.html" : "./customer.html";
  }, 1500);
}

function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}
function createFloatingIcons() {
  const foodIconsContainer = document.querySelector(".food-icons");
  const icons = [
    "fa-pizza-slice",
    "fa-hamburger",
    "fa-ice-cream",
    "fa-coffee",
    "fa-drumstick-bite",
    "fa-cookie",
    "fa-cake",
    "fa-apple-alt",
    "fa-lemon",
    "fa-cheese",
  ];

  for (let i = 0; i < 15; i++) {
    const icon = document.createElement("i");
    icon.className = `fas ${
      icons[Math.floor(Math.random() * icons.length)]
    } food-icon`;
    icon.style.top = `${Math.random() * 90}%`;
    icon.style.left = `${Math.random() * 90}%`;
    icon.style.fontSize = `${Math.random() * 1.5 + 1.5}rem`;
    icon.style.opacity = Math.random() * 0.4 + 0.1;
    foodIconsContainer.appendChild(icon);
  }
}

createFloatingIcons();

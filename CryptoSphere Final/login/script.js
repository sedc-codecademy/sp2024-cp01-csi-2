document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const balance = parseFloat(document.getElementById("signup-balance").value);
  const termsAccepted = document.getElementById("signup-terms").checked;
  const newsletter = document.getElementById("signup-newsletter").checked;

  if (!termsAccepted) {
    document.getElementById("message").style.color = "red";
    document.getElementById("message").textContent =
      "You must accept the terms and conditions.";
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const accountExists = accounts.some((acc) => acc.email === email);

  const message = document.getElementById("message");
  if (accountExists) {
    message.style.color = "red";
    message.textContent = "Account with this email already exists.";
  } else {
    const newAccount = { email, password, balance, newsletter, wallet: {} };
    accounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(accounts));
    localStorage.setItem("activeAccount", JSON.stringify(newAccount));
    message.style.color = "green";
    message.textContent = "Account created successfully!";
    showPopup("Account created successfully!");
    setTimeout(() => (window.location.href = "../sim/index.html"), 2000);
  }
});
document.addEventListener("DOMContentLoaded", function () {
  var toggler = document.querySelector(".navbar-toggler");
  var navbarCollapse = document.querySelector("#navbarNav");

  toggler.addEventListener("click", function () {
    navbarCollapse.classList.toggle("show");
  });
});
const popularValuesDiv = document.getElementById("popular-values");

// Login Script
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const account = accounts.find(
    (acc) => acc.email === email && acc.password === password
  );

  const message = document.getElementById("message");
  if (account) {
    message.style.color = "green";
    message.textContent = "Login successful!";
    localStorage.setItem("activeAccount", JSON.stringify(account));
    setTimeout(() => (window.location.href = "../sim/index.html"), 1000);
  } else {
    message.style.color = "red";
    message.textContent = "Invalid email or password.";
  }
});

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const balance = parseFloat(document.getElementById("signup-balance").value);
  const termsAccepted = document.getElementById("signup-terms").checked;
  const newsletter = document.getElementById("signup-newsletter").checked;

  if (!termsAccepted) {
    document.getElementById("message").style.color = "red";
    document.getElementById("message").textContent =
      "You must accept the terms and conditions.";
    return;
  }

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const accountExists = accounts.some((acc) => acc.email === email);

  const message = document.getElementById("message");
  if (accountExists) {
    message.style.color = "red";
    message.textContent = "Account with this email already exists.";
  } else {
    const newAccount = { email, password, balance, newsletter, wallet: {} };
    accounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(accounts));
    localStorage.setItem("activeAccount", JSON.stringify(newAccount));
    showPopup("Account created successfully!");
    setTimeout(() => (window.location.href = "../sim/index.html"), 2000);
  }
});

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const account = accounts.find(
    (acc) => acc.email === email && acc.password === password
  );

  const message = document.getElementById("message");
  if (account) {
    message.style.color = "green";
    message.textContent = "Login successful!";
    localStorage.setItem("activeAccount", JSON.stringify(account));
    showPopup("Login successful!");
    setTimeout(() => (window.location.href = "../sim/index.html"), 2000);
  } else {
    message.style.color = "red";
    message.textContent = "Invalid email or password.";
  }
});

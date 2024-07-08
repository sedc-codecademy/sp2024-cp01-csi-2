// Function to update UI based on logged-in status
function UpdateUIForLoggedInUser() {
  const activeAccount = JSON.parse(localStorage.getItem("activeAccount"));
  const loginElement = document.getElementById("login");
  const registerButton = document.getElementById("register-button");

  loginElement.innerHTML = "";

  if (activeAccount) {
    loginElement.innerHTML = `
            <button id="logout" class="btn btn-secondary">Logout</button> 
            <span>Welcome, ${activeAccount.email}</span>`;
    registerButton.style.display = "none";
    document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("activeAccount");
      window.location.href = "./../login/index.html";
    });
  } else {
    loginElement.innerHTML = "";
    loginElement.innerHTML =
      '<a class="nav-link" id="auth-button" href="./../login/index.html">Log In</a>';
    registerButton.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", UpdateUIForLoggedInUser);

document.addEventListener("DOMContentLoaded", function () {
  var toggler = document.querySelector(".navbar-toggler");
  var navbarCollapse = document.querySelector("#navbarNav");

  toggler.addEventListener("click", function () {
    navbarCollapse.classList.toggle("show");
  });
});
const popularValuesDiv = document.getElementById("popular-values");

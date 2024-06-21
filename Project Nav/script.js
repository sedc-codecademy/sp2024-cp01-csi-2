const navbar = document.querySelector(".navbar");

function toggleNavbarSmaller() {
  if (window.scrollY > 0) {
    navbar.classList.add("navbar-smaller");
  } else {
    navbar.classList.remove("navbar-smaller");
  }
}

window.addEventListener("scroll", toggleNavbarSmaller);

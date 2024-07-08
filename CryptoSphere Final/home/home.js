// Function to update UI based on logged-in status
function UpdateUIForLoggedInUser() {
    const activeAccount = JSON.parse(localStorage.getItem('activeAccount'));
    const loginElement = document.getElementById('login');
    const authButton = document.getElementById('auth-button');
    const registerButton = document.getElementById('register-button');

    if (activeAccount) {
        loginElement.innerHTML = `<button id="logout" class="btn btn-secondary">Logout</button> <span>Welcome, ${activeAccount.email}</span>`;
        if (registerButton) registerButton.style.display = 'none'; // Hide register button when logged in
        if (authButton) authButton.style.display = 'none'; // Hide login link when logged in
        document.getElementById('logout').addEventListener('click', function() {
            localStorage.removeItem('activeAccount');
            window.location.href = './../login/index.html'; // Redirect to login page on logout
        });
    } else {
        loginElement.innerHTML = '<a class="nav-link" id="auth-button" href="./../login/index.html">Log In</a>';
        if (registerButton) registerButton.style.display = 'block'; // Show register button when not logged in
    }
}

// Call the function to update the UI on page load
document.addEventListener('DOMContentLoaded', UpdateUIForLoggedInUser);

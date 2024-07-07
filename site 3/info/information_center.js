// Function to update UI based on logged-in status
function UpdateUIForLoggedInUser() {
    const activeAccount = JSON.parse(localStorage.getItem('activeAccount'));
    const loginElement = document.getElementById('login');
    const registerButton = document.getElementById('register-button');

    loginElement.innerHTML = ''; // Clear the login element to prevent overlapping

    if (activeAccount) {
        loginElement.innerHTML = `
            <button id="logout" class="btn btn-secondary">Logout</button> 
            <span>Welcome, ${activeAccount.email}</span>`;
        registerButton.style.display = 'none'; // Hide register button when logged in
        document.getElementById('logout').addEventListener('click', function() {
            localStorage.removeItem('activeAccount');
            window.location.href = './../login/index.html'; // Redirect to login page on logout
        });
    } else {
        loginElement.innerHTML = ''; // Clear any residual content
        loginElement.innerHTML = '<a class="nav-link" id="auth-button" href="./../login/index.html">Log In</a>';
        registerButton.style.display = 'block'; // Show register button when not logged in
    }
}

// Call the function to update the UI on page load
document.addEventListener('DOMContentLoaded', UpdateUIForLoggedInUser);

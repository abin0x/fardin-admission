// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Function to handle login
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set admin session
        localStorage.setItem('adminLoggedIn', 'true');
        // Redirect to admin panel
        window.location.href = 'admin.html';
    } else {
        alert('Invalid username or password!');
    }

    return false;
} 
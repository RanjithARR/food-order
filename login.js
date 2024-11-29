document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            localStorage.setItem('userId', data.userId); // Save user ID for session
            window.location.href = 'filter.html';
        })
        .catch((error) => alert('Login failed: ' + error));
});

// On successful login (e.g., in login.js)
// On successful login (e.g., in login.js)
localStorage.setItem('userId', userId);


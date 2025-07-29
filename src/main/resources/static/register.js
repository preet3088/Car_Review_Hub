document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const formWrapper = document.getElementById('registration-form-wrapper');
    const successWrapper = document.getElementById('registration-success-wrapper');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        errorMessage.textContent = ''; // Clear previous errors

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                // --- THIS IS THE FIX ---
                // Hide the form and show the success message
                formWrapper.style.display = 'none';
                successWrapper.style.display = 'block';
            } else {
                return response.text().then(text => { throw new Error(text) });
            }
        })
        .catch(error => {
            errorMessage.textContent = error.message || 'Registration failed. Please try again.';
        });
    });
});

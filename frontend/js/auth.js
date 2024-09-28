import api from './api.js';

function showMessage(message, isError = false) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    messageElement.style.color = isError ? 'red' : 'green';
}

function handleCredentialResponse(response) {
    const idToken = response.credential;
    api.googleAuth(idToken)
        .then(res => {
            if (res.ok) {
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                localStorage.setItem('is_doctor', res.data.is_doctor);
                showMessage('Login successful!');
                // Redirect to appropriate dashboard based on user type
                window.location.href = res.data.is_doctor ? 'landing_page.html' : 'landing_page.html';
            } else {
                showMessage('Error: ' + res.data.message, true);
            }
        })
        .catch(error => console.error('Error during sign-in:', error));
}

function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: '836345213785-7ahselh9p78a93lu7gofpb07venfcmba.apps.googleusercontent.com',

        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large' }
    );

    google.accounts.id.prompt();
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const sendOtpBtn = document.getElementById('sendOtpBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            api.login({ email, password })
                .then(res => {
                    if (res.ok) {
                        localStorage.setItem('access_token', res.data.access);
                        localStorage.setItem('refresh_token', res.data.refresh);
                        localStorage.setItem('is_doctor', res.data.is_doctor);
                        showMessage('Login successful!');
                        // Redirect to appropriate dashboard based on user type
                        window.location.href = res.data.is_doctor ? 'landing_page.html' : 'landing_page.html';
                    } else {
                        showMessage('Error: ' + res.data.message, true);
                    }
                });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userData = {
                first_name: document.getElementById('first_name').value,
                last_name: document.getElementById('last_name').value,
                email: document.getElementById('email').value,
                otp: document.getElementById('otp').value,
                password: document.getElementById('password').value,
                confirm_password: document.getElementById('confirm_password').value,
                is_doctor: document.getElementById('is_doctor').checked
            };

            api.register(userData)
                .then(res => {
                    if (res.ok) {
                        showMessage('Registration successful! Please log in.');
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        showMessage('Error: ' + res.data.message, true);
                    }
                });
        });
    }

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', () => {
            const email = document.getElementById('email').value;
            api.sendOtp(email)
                .then(res => {
                    if (res.ok) {
                        showMessage('OTP sent successfully. Please check your email.');
                    } else {
                        showMessage('Error: ' + res.data.message, true);
                    }
                });
        });
    }

    initializeGoogleSignIn();
});

export { initializeGoogleSignIn };
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const formSwitch = document.getElementById('formSwitch');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');

    if (!loginForm || !signupForm || !formSwitch || !loginError || !signupError) {
        console.error('Required DOM elements not found');
        return;
    }

    // Form Switch Logic
    formSwitch.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginForm.style.display === 'none') {
            // Switch to login
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            formSwitch.textContent = "Sign up";
            // Clear error messages
            loginError.style.display = 'none';
            signupError.style.display = 'none';
        } else {
            // Switch to signup
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            formSwitch.textContent = 'Login';
            // Clear error messages
            loginError.style.display = 'none';
            signupError.style.display = 'none';
        }
    });

    // Login Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Clear previous error
        loginError.style.display = 'none';

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Store user data in localStorage
                const user = {
                    email: userCredential.user.email,
                    name: userCredential.user.displayName
                };
                localStorage.setItem('user', JSON.stringify(user));

                // Redirect based on email
                if (email === 'irfanraz67@gmail.com') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            })
            .catch((error) => {
                // Handle login error
                loginError.style.display = 'block';
                switch (error.code) {
                    case 'auth/invalid-email':
                        loginError.textContent = 'Invalid email address.';
                        break;
                    case 'auth/user-disabled':
                        loginError.textContent = 'This account has been disabled.';
                        break;
                    case 'auth/user-not-found':
                        loginError.textContent = 'No account found with this email.';
                        break;
                    case 'auth/wrong-password':
                        loginError.textContent = 'Incorrect password.';
                        break;
                    default:
                        loginError.textContent = 'Invalid email address or password';
                }
            });
    });

    // Signup Form Submit
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        // Clear previous error
        signupError.style.display = 'none';

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Update user profile with name
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                // Show success alert
                alert('Signup successful! Please login.');
                // Switch to login form
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
                formSwitch.textContent = "Sign up";
                // Clear signup form
                signupForm.reset();
            })
            .catch((error) => {
                // Handle signup error
                signupError.style.display = 'block';
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        signupError.textContent = 'An account with this email already exists.';
                        break;
                    case 'auth/invalid-email':
                        signupError.textContent = 'Invalid email address.';
                        break;
                    case 'auth/operation-not-allowed':
                        signupError.textContent = 'Email/password accounts are not enabled.';
                        break;
                    case 'auth/weak-password':
                        signupError.textContent = 'Password should be at least 6 characters.';
                        break;
                    default:
                        signupError.textContent = error.message;
                }
            });
    });
}); 
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const message = document.getElementById('message');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePasswordBtn.innerHTML = type === 'password' 
            ? '<i class="fas fa-eye"></i>' 
            : '<i class="fas fa-eye-slash"></i>';
    });

    // Form validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const showError = (input, message) => {
        const errorDiv = input.parentElement.querySelector('.error-message');
        errorDiv.textContent = message;
        input.classList.add('error');
    };

    const clearError = (input) => {
        const errorDiv = input.parentElement.querySelector('.error-message');
        errorDiv.textContent = '';
        input.classList.remove('error');
    };

    // Real-time validation
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() === '') {
            clearError(emailInput);
        } else if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
        } else {
            clearError(emailInput);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.trim() === '') {
            clearError(passwordInput);
        } else if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, 'Password must be at least 8 characters long');
        } else {
            clearError(passwordInput);
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        // Validate email
        if (!email) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!password) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError(passwordInput, 'Password must be at least 8 characters long');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const loginBtn = loginForm.querySelector('.login-btn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');
        
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        try {
            // Simulate API call - Replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Successful login - Replace with actual login logic
            window.location.href = 'dashboard.html';
        } catch (error) {
            message.textContent = 'Invalid email or password';
            message.classList.add('error');
            
            // Reset button state
            loginBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    });

    // Forgot password modal
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        forgotPasswordModal.classList.remove('active');
    });

    forgotPasswordModal.addEventListener('click', (e) => {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.classList.remove('active');
        }
    });

    // Reset password form
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const resetEmail = document.getElementById('resetEmail');
        const resetBtn = resetPasswordForm.querySelector('.reset-btn');
        
        if (!validateEmail(resetEmail.value)) {
            showError(resetEmail, 'Please enter a valid email address');
            return;
        }

        // Show loading state
        const originalText = resetBtn.textContent;
        resetBtn.textContent = 'Sending...';
        resetBtn.disabled = true;

        try {
            // Simulate API call - Replace with actual API endpoint
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            message.textContent = 'Password reset link has been sent to your email';
            message.classList.remove('error');
            message.classList.add('success');
            
            forgotPasswordModal.classList.remove('active');
            resetPasswordForm.reset();
        } catch (error) {
            message.textContent = 'Failed to send reset link. Please try again.';
            message.classList.add('error');
        } finally {
            resetBtn.textContent = originalText;
            resetBtn.disabled = false;
        }
    });

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-buttons button');
    socialButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const provider = button.classList.contains('google-btn') ? 'Google' : 'LinkedIn';
            
            // Show loading state
            const originalText = button.textContent;
            const icon = button.querySelector('i').cloneNode(true);
            button.innerHTML = '';
            button.appendChild(icon);
            button.appendChild(document.createTextNode(' Connecting...'));
            button.disabled = true;

            try {
                // Simulate API call - Replace with actual OAuth flow
                await new Promise(resolve => setTimeout(resolve, 1500));
                window.location.href = 'dashboard.html';
            } catch (error) {
                message.textContent = `Failed to connect with ${provider}. Please try again.`;
                message.classList.add('error');
                
                // Reset button state
                button.innerHTML = '';
                button.appendChild(icon);
                button.appendChild(document.createTextNode(` ${provider}`));
                button.disabled = false;
            }
        });
    });
}); 
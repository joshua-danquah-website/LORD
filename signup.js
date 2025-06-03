document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const signupForm = document.getElementById('signupForm');
    const messageElement = document.getElementById('message');
    const inputs = signupForm.querySelectorAll('input');
    const submitButton = signupForm.querySelector('.signup-btn');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoader = submitButton.querySelector('.btn-loader');

    // Role selection
    const roleButtons = document.querySelectorAll('.role-btn');
    const jobseekerFields = document.querySelector('.jobseeker-fields');
    const employerFields = document.querySelector('.employer-fields');

    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            roleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (button.dataset.role === 'jobseeker') {
                jobseekerFields.style.display = 'block';
                employerFields.style.display = 'none';
                document.getElementById('experience').required = true;
                document.getElementById('company').required = false;
            } else {
                jobseekerFields.style.display = 'none';
                employerFields.style.display = 'block';
                document.getElementById('experience').required = false;
                document.getElementById('company').required = true;
            }
        });
    });

    // Password visibility toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            button.querySelector('i').className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
        });
    });

    // Password strength checker
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    const requirements = document.querySelectorAll('.password-requirements li');

    const updatePasswordStrength = (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        requirements.forEach(req => {
            const requirement = req.dataset.requirement;
            const icon = req.querySelector('i');
            if (checks[requirement]) {
                icon.className = 'fas fa-check';
                req.style.color = 'var(--success-color)';
            } else {
                icon.className = 'fas fa-times';
                req.style.color = '#6b7280';
            }
        });

        const strength = Object.values(checks).filter(Boolean).length;
        let strengthLevel = '';

        if (strength <= 2) {
            strengthLevel = 'weak';
            strengthBar.style.backgroundColor = 'var(--error-color)';
            strengthBar.style.width = '33%';
        } else if (strength <= 4) {
            strengthLevel = 'medium';
            strengthBar.style.backgroundColor = 'var(--warning-color)';
            strengthBar.style.width = '66%';
        } else {
            strengthLevel = 'strong';
            strengthBar.style.backgroundColor = 'var(--success-color)';
            strengthBar.style.width = '100%';
        }

        strengthText.textContent = strengthLevel.charAt(0).toUpperCase() + strengthLevel.slice(1);
    };

    passwordInput.addEventListener('input', () => {
        updatePasswordStrength(passwordInput.value);
    });

    // Modal handling
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const termsLink = document.querySelector('.terms-link');
    const privacyLink = document.querySelector('.privacy-link');
    const closeButtons = document.querySelectorAll('.close-modal');

    const openModal = (modal) => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(termsModal);
    });

    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(privacyModal);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Form validation
    const validateInput = (input) => {
        const value = input.value.trim();
        const errorMessage = input.nextElementSibling;
        let isValid = true;
        let message = '';

        switch (input.type) {
            case 'text':
                if (input.id === 'company' && input.required) {
                    isValid = value.length >= 2;
                    message = 'Company name must be at least 2 characters long';
                } else if (input.id === 'name') {
                    isValid = value.length >= 2;
                    message = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                isValid = /^[^\s@]+@[^@\s]+\.[^@\s]+$/.test(value);
                message = 'Please enter a valid email address';
                break;
            case 'tel':
                if (value) {
                    isValid = /^[0-9\+\-\(\)\s]+$/.test(value);
                    message = 'Please enter a valid phone number';
                } else {
                    isValid = true; // Phone is optional
                }
                break;
            case 'password':
                if (input.id === 'password') {
                    const strength = document.querySelectorAll('.password-requirements li i.fa-check').length;
                    isValid = strength >= 3; // At least 3 requirements met
                    message = 'Password must meet at least 3 requirements';
                } else {
                    const password = document.getElementById('password').value;
                    isValid = value === password;
                    message = 'Passwords do not match';
                }
                break;
            case 'checkbox':
                if (input.id === 'terms') {
                    isValid = input.checked;
                    message = 'You must accept the terms and privacy policy';
                }
                break;
        }

        if (input.required && value === '') {
            isValid = false;
            message = 'This field is required';
        }

        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
            errorMessage.textContent = '';
        } else {
            input.classList.remove('valid');
            input.classList.add('error');
            errorMessage.textContent = message;
        }

        return isValid;
    };

    // Add input validation styling
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });

        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });

    // Form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all inputs
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showMessage('Please fill in all fields correctly.', 'error');
            return;
        }

        // Show loading state
        setLoading(true);

        // Get form data
        const formData = {
            role: document.querySelector('.role-btn.active').dataset.role,
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            password: document.getElementById('password').value,
            newsletter: document.getElementById('newsletter').checked
        };

        if (formData.role === 'jobseeker') {
            formData.experience = document.getElementById('experience').value;
        } else {
            formData.company = document.getElementById('company').value.trim();
        }

        // Simulate API call
        try {
            showMessage('Creating your account...', 'info');
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate successful signup
            showMessage('Account created successfully! Redirecting...', 'success');
            
            // Reset form
            signupForm.reset();
            inputs.forEach(input => {
                input.classList.remove('valid', 'error');
            });
            strengthBar.style.width = '0';
            strengthText.textContent = 'Weak';
            requirements.forEach(req => {
                const icon = req.querySelector('i');
                icon.className = 'fas fa-times';
                req.style.color = '#6b7280';
            });

            // Redirect after successful signup (simulate)
            setTimeout(() => {
                window.location.href = 'Project.html';
            }, 2000);

        } catch (error) {
            showMessage('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    });

    // Social signup buttons
    const googleBtn = document.querySelector('.google-btn');
    const linkedinBtn = document.querySelector('.linkedin-btn');

    googleBtn.addEventListener('click', () => {
        showMessage('Google sign up coming soon!', 'info');
    });

    linkedinBtn.addEventListener('click', () => {
        showMessage('LinkedIn sign up coming soon!', 'info');
    });
});

// Set loading state
function setLoading(isLoading) {
    const submitButton = document.querySelector('.signup-btn');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoader = submitButton.querySelector('.btn-loader');

    submitButton.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline-block';
    btnLoader.style.display = isLoading ? 'inline-block' : 'none';
}

// Message display function
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = type;
    messageElement.style.display = 'block';

    if (type === 'success' || type === 'info') {
        messageElement.style.backgroundColor = type === 'success' ? '#ecfdf5' : '#eff6ff';
        messageElement.style.color = type === 'success' ? '#059669' : '#2563eb';
        messageElement.style.border = `1px solid ${type === 'success' ? '#34d399' : '#93c5fd'}`;
    }

    // Auto-hide info messages after 5 seconds
    if (type === 'info') {
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}
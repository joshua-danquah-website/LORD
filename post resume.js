document.getElementById("resumeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const message = document.getElementById('message');
    
    // Get form data
    const formData = new FormData(form);
    const resumeFile = document.getElementById("resumeFile").files[0];
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'experience', 'skills'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        const value = input.value.trim();
        
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });
    
    // Validate email format
    const email = document.getElementById('email');
    if (email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate file
    if (!resumeFile) {
        showError('Please upload your resume');
        isValid = false;
    }
    
    // Validate terms checkbox
    const terms = document.getElementById('terms');
    if (!terms.checked) {
        const errorDiv = terms.parentElement.parentElement.querySelector('.error-message');
        errorDiv.textContent = 'Please accept the terms and conditions';
        errorDiv.style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) {
        showFormMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    btnText.textContent = 'Uploading...';
    
    try {
        // Simulate API call - replace with actual API endpoint
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success state
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        btnText.textContent = 'Resume Uploaded!';
        showFormMessage('Your resume has been successfully uploaded!', 'success');
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.classList.remove('success');
            btnText.textContent = 'Upload Resume';
            removeFile();
        }, 3000);
        
    } catch (error) {
        // Error state
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('error');
        btnText.textContent = 'Upload Failed';
        showFormMessage('Failed to upload resume. Please try again.', 'error');
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('error');
            btnText.textContent = 'Upload Resume';
        }, 3000);
    }
});

function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('invalid');
    formGroup.classList.remove('valid');
    const errorDiv = formGroup.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('invalid');
    formGroup.classList.add('valid');
    const errorDiv = formGroup.querySelector('.error-message');
    errorDiv.style.display = 'none';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `form-message ${type} show`;
}

document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('resumeFile');
    const filePreview = document.getElementById('filePreview');
    const fileName = filePreview.querySelector('.file-name');
    const fileMeta = filePreview.querySelector('.file-meta');
    const fileIcon = filePreview.querySelector('.file-icon');
    const removeButton = filePreview.querySelector('.remove-file');
    const errorMessage = document.querySelector('.file-upload-group .error-message');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when file is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', handleFiles);
    
    // Handle remove button click
    removeButton.addEventListener('click', removeFile);

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }

    function handleFiles(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const fileType = file.type;
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (!validTypes.includes(fileType)) {
                showError('Please upload a PDF or Word document');
                return;
            }

            // Check file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showError('File size must be less than 5MB');
                return;
            }

            // Update file icon based on type
            if (fileType === 'application/pdf') {
                fileIcon.className = 'fas fa-file-pdf file-icon';
            } else {
                fileIcon.className = 'fas fa-file-word file-icon';
            }

            // Update file details
            fileName.textContent = file.name;
            fileMeta.textContent = formatFileSize(file.size);
            
            // Show preview
            filePreview.style.display = 'block';
            dropZone.style.display = 'none';
            errorMessage.style.display = 'none';
        }
    }

    function removeFile() {
        fileInput.value = '';
        filePreview.style.display = 'none';
        dropZone.style.display = 'block';
        errorMessage.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        fileInput.value = '';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});
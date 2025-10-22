class ContactForm {
    constructor() {
        this.form = document.querySelector('[data-testid="test-contact-form"]');
        this.successMessage = document.querySelector('[data-testid="test-contact-success"]');
        this.submitButton = document.querySelector('[data-testid="test-contact-submit"]');
        
        this.fields = {
            name: {
                element: document.querySelector('[data-testid="test-contact-name"]'),
                error: document.querySelector('[data-testid="test-contact-error-name"]'),
                validate: this.validateName.bind(this)
            },
            email: {
                element: document.querySelector('[data-testid="test-contact-email"]'),
                error: document.querySelector('[data-testid="test-contact-error-email"]'),
                validate: this.validateEmail.bind(this)
            },
            subject: {
                element: document.querySelector('[data-testid="test-contact-subject"]'),
                error: document.querySelector('[data-testid="test-contact-error-subject"]'),
                validate: this.validateSubject.bind(this)
            },
            message: {
                element: document.querySelector('[data-testid="test-contact-message"]'),
                error: document.querySelector('[data-testid="test-contact-error-message"]'),
                validate: this.validateMessage.bind(this)
            }
        };

        this.init();
    }

    init() {
        // Real-time validation
        Object.values(this.fields).forEach(({ element, validate }) => {
            element.addEventListener('blur', validate);
            element.addEventListener('input', () => {
                if (element.classList.contains('invalid')) {
                    validate();
                }
            });
        });

        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    // Validation methods
    validateName() {
        const value = this.fields.name.element.value.trim();
        const isValid = value.length > 0;
        
        this.setFieldValidity('name', isValid, 'Please enter your full name');
        return isValid;
    }

    validateEmail() {
        const value = this.fields.email.element.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);
        
        this.setFieldValidity('email', isValid, 'Please enter a valid email address');
        return isValid;
    }

    validateSubject() {
        const value = this.fields.subject.element.value.trim();
        const isValid = value.length > 0;
        
        this.setFieldValidity('subject', isValid, 'Please enter a subject');
        return isValid;
    }

    validateMessage() {
        const value = this.fields.message.element.value.trim();
        const isValid = value.length >= 10;
        
        this.setFieldValidity('message', isValid, 'Please enter a message with at least 10 characters');
        return isValid;
    }

    setFieldValidity(fieldName, isValid, errorMessage) {
        const field = this.fields[fieldName];
        
        if (isValid) {
            field.element.classList.remove('invalid');
            field.element.classList.add('valid');
            field.error.classList.add('hidden');
            field.element.setAttribute('aria-invalid', 'false');
        } else {
            field.element.classList.remove('valid');
            field.element.classList.add('invalid');
            field.error.textContent = errorMessage;
            field.error.classList.remove('hidden');
            field.element.setAttribute('aria-invalid', 'true');
        }
    }

    validateForm() {
        let isFormValid = true;
        
        Object.keys(this.fields).forEach(fieldName => {
            const isValid = this.fields[fieldName].validate();
            if (!isValid) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            // Focus on first invalid field
            const firstInvalidField = Object.values(this.fields).find(field => 
                field.element.classList.contains('invalid')
            );
            if (firstInvalidField) {
                firstInvalidField.element.focus();
            }
            return;
        }

        // Simulate form submission
        this.setLoadingState(true);
        
        try {
            // In a real application, you would send data to a server here
            await this.simulateApiCall();
            
            this.showSuccessMessage();
            this.form.reset();
            this.clearValidationStates();
            
        } catch (error) {
            this.showErrorMessage('Sorry, there was an error sending your message. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500); // Simulate network delay
        });
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.classList.add('loading');
            this.submitButton.setAttribute('aria-label', 'Sending message...');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading');
            this.submitButton.removeAttribute('aria-label');
        }
    }

    showSuccessMessage() {
        this.successMessage.classList.remove('hidden');
        this.successMessage.focus(); // Move focus to success message for screen readers
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            this.successMessage.classList.add('hidden');
        }, 5000);
    }

    showErrorMessage(message) {
        // Create temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'polite');
        
        this.form.insertBefore(errorDiv, this.form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    clearValidationStates() {
        Object.values(this.fields).forEach(({ element, error }) => {
            element.classList.remove('valid', 'invalid');
            error.classList.add('hidden');
            element.removeAttribute('aria-invalid');
        });
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}
// Form Steps Handling
let currentStep = 1;

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    
    // Show current step
    document.querySelector(`#step${step}`).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step-item').forEach(el => {
        const stepNum = parseInt(el.dataset.step);
        if (stepNum <= step) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update side summary if needed
    if (step === 3) {
        updateReviewSection();
    }
}

// Form Navigation
document.querySelectorAll('.btn-next').forEach(button => {
    button.addEventListener('click', function() {
        if (validateCurrentStep()) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

document.querySelectorAll('.btn-prev').forEach(button => {
    button.addEventListener('click', function() {
        currentStep--;
        showStep(currentStep);
    });
});

// Form Validation
function validateCurrentStep() {
    const currentStepEl = document.querySelector(`#step${currentStep}`);
    const inputs = currentStepEl.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        const errorMessage = input.nextElementSibling;
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
            errorMessage.textContent = 'This field is required';
        } else {
            input.classList.remove('invalid');
            errorMessage.textContent = '';
            
            // Field-specific validation
            if (input.id === 'email' && !validateEmail(input.value)) {
                isValid = false;
                input.classList.add('invalid');
                errorMessage.textContent = 'Please enter a valid email';
            } else if (input.id === 'zipCode' && !/^\d{5}$/.test(input.value)) {
                isValid = false;
                input.classList.add('invalid');
                errorMessage.textContent = 'Please enter a valid 5-digit ZIP code';
            }
        }
    });

    return isValid;
}

// Field Validation
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Payment Method Selection
document.querySelectorAll('.payment-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.payment-option').forEach(option => {
            option.classList.remove('selected');
        });
        this.closest('.payment-option').classList.add('selected');
    });
});

// Update Review Section
function updateReviewSection() {
    // Update shipping details with icons
    const shippingDetails = [
        { key: 'Full Name', value: document.getElementById('fullName').value, icon: 'fa-user' },
        { key: 'Email', value: document.getElementById('email').value, icon: 'fa-envelope' },
        { key: 'Address', value: document.getElementById('address').value, icon: 'fa-home' },
        { key: 'City', value: document.getElementById('city').value, icon: 'fa-city' },
        { key: 'ZIP Code', value: document.getElementById('zipCode').value, icon: 'fa-map-marker-alt' }
    ];

    const shippingHtml = shippingDetails
        .map(({ key, value, icon }) => `
            <div class="review-detail">
                <span><i class="fas ${icon} me-2"></i>${key}:</span>
                <span>${value}</span>
            </div>
        `)
        .join('');
    document.getElementById('shippingReview').innerHTML = shippingHtml;

    // Update payment method with icon
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentIcons = {
        'Credit Card': 'fa-credit-card',
        'PayPal': 'fa-paypal',
        'Cash on Delivery': 'fa-money-bill-wave'
    };
    
    document.getElementById('paymentReview').innerHTML = selectedPayment ? 
        `<div class="review-detail">
            <span><i class="fas ${paymentIcons[selectedPayment.value]} me-2"></i>Payment Method:</span>
            <span>${selectedPayment.value}</span>
         </div>` : '';

    // Update cart items
    updateCartItems();
    updateOrderSummary();
}

// Update Cart Items
function updateCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Update cart items list with proper price and quantity formatting
    const cartItemsHtml = cartItems.map(item => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        return `
            <div class="cart-item">
                <div class="item-details">
                    <div class="item-name">${item.name || 'Unnamed Item'}</div>
                    <div class="item-price">$${price.toFixed(2)}</div>
                </div>
                <div class="item-quantity">x${quantity}</div>
            </div>
        `;
    }).join('');
    
    // Update cart items list
    const cartItemsList = document.getElementById('cartItemsList');
    if (cartItemsList) cartItemsList.innerHTML = cartItemsHtml;
}

// Order Summary Calculation
function updateOrderSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        subtotal += price * quantity;
    });
    
    const shipping = 20;
    const total = subtotal + shipping;
    
    // Update summary totals
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Complete Order Button Handling
document.getElementById('completeOrderBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cartItems.length === 0) {
        showToast('Error', 'Your cart is empty! Please add items before placing an order.', 'error');
        return;
    }

    if (!validateCurrentStep()) {
        showToast('Error', 'Please fill in all required fields correctly.', 'error');
        return;
    }

    const button = this;
    if (!button.classList.contains('processing')) {
        button.classList.add('processing');
        showLoading();
        
        // Simulate order processing
        setTimeout(() => {
            hideLoading();
            button.classList.remove('processing');
            
            // Clear cart and show success message
            localStorage.removeItem('cartItems');
            showToast('Success', 'Order placed successfully!', 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 3000);
    }
});

// Loading Overlay
function showLoading() {
    document.querySelector('.loading-overlay').classList.add('active');
}

function hideLoading() {
    document.querySelector('.loading-overlay').classList.remove('active');
}

// Toast Messages
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('successToast');
    const icon = toast.querySelector('.toast-icon i');
    const titleEl = toast.querySelector('h4');
    const messageEl = toast.querySelector('p');
    
    // Update toast content
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Update toast style based on type
    toast.className = `success-toast ${type}`;
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    // Show toast
    toast.classList.add('active');
    
    // Hide toast after delay
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showStep(1);
    updateCartItems();
    updateOrderSummary();
});
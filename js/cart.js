// Function to display cart items
function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const cartContainer = document.getElementById("cartItems");
    
    if (!cartContainer) return;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="product.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        updateCartSummary(0);
        return;
    }

    let cartHTML = '';
    let subtotal = 0;

    cartItems.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        subtotal += itemTotal;
        
        // Check if item is in wishlist
        const isInWishlist = wishlistItems.some(wishlistItem => wishlistItem.name === item.name);
        const heartClass = isInWishlist ? 'fas fa-heart text-danger' : 'far fa-heart';
        
        cartHTML += `
            <div class="cart-item bg-white p-3 mb-3 cart-animation" style="animation-delay: ${index * 0.1}s">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.img || `img/product-${(index % 8) + 1}.jpg`}" alt="${item.name}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-3">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="text-primary mb-0">$${item.price.toFixed(2)} × ${quantity}</p>
                        <p class="text-success mb-0">Total: $${itemTotal.toFixed(2)}</p>
                    </div>
                    <div class="col-md-3">
                        <div class="quantity-controls">
                            <button class="quantity-btn btn btn-outline-secondary" onclick="updateQuantity(${index}, -1)">
                                <i class="fa fa-minus"></i>
                            </button>
                            <span class="mx-2">${quantity}</span>
                            <button class="quantity-btn btn btn-outline-secondary" onclick="updateQuantity(${index}, 1)">
                                <i class="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="cart-item-actions">
                            <button class="btn btn-link text-danger remove-btn" onclick="removeItem(${index})">
                                <i class="fa fa-trash"></i>
                            </button>
                            <button class="btn btn-link save-for-later" onclick="toggleWishlist(${index})">
                                <i class="${heartClass}"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = cartHTML;
    updateCartSummary(subtotal);
}

// Function to update cart summary
function updateCartSummary(subtotal) {
    const shipping = 20; // Fixed shipping fee of $20
    const total = subtotal + shipping;

    const elements = {
        subtotal: document.getElementById("subtotal"),
        shipping: document.getElementById("shipping"),
        total: document.getElementById("total")
    };

    if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.shipping) elements.shipping.textContent = `$${shipping.toFixed(2)}`;
    if (elements.total) elements.total.textContent = `$${total.toFixed(2)}`;
}

// Function to update quantity
function updateQuantity(index, change) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (!cartItems[index]) return;

    const newQuantity = (cartItems[index].quantity || 1) + change;
    
    if (newQuantity < 1) {
        removeItem(index);
        return;
    }

    cartItems[index].quantity = newQuantity;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    displayCart();
    updateCartCount();
    showToast(change > 0 ? 'Quantity increased!' : 'Quantity decreased!');
}

// Function to remove item
function removeItem(index) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (!cartItems[index]) return;

    const removedItem = cartItems[index];
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    displayCart();
    updateCartCount();
    showToast(`${removedItem.name} removed from cart!`);
}

// Function to toggle wishlist
function toggleWishlist(cartIndex) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    
    if (!cartItems[cartIndex]) return;
    
    const item = cartItems[cartIndex];
    const existingIndex = wishlistItems.findIndex(wishlistItem => wishlistItem.name === item.name);
    
    if (existingIndex !== -1) {
        // Remove from wishlist
        wishlistItems.splice(existingIndex, 1);
        showToast('Removed from Wishlist!');
    } else {
        // Add to wishlist
        wishlistItems.push({
            name: item.name,
            price: item.price,
            img: item.img
        });
        showToast('Added to Wishlist!');
    }
    
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    updateWishlistCount();
    displayCart(); // Refresh cart display to update heart icons
}

// Function to proceed to checkout
function checkout() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Here you can add payment gateway integration
    showToast('Proceeding to checkout...');
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 1500);
}

// Function to update cart count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

// Function to update wishlist count
function updateWishlistCount() {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const wishlistCount = document.getElementById("wishlistCount");
    if (wishlistCount) {
        wishlistCount.textContent = wishlistItems.length;
    }
}

// Function to show toast messages
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartCount();
    updateWishlistCount();
}); 
// Wishlist Functions
function toggleWishlist(productName, productPrice, productImg) {
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    
    // Check if product already exists in wishlist
    const existingIndex = wishlist.findIndex(item => item.name === productName);
    
    if (existingIndex !== -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        showToast('Removed from Wishlist!');
    } else {
        // Add to wishlist
        const product = {
            name: productName,
            price: productPrice,
            img: productImg || `img/product-${(wishlist.length % 8) + 1}.jpg`
        };
        wishlist.push(product);
        showToast('Added to Wishlist!');
    }
    
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
    updateWishlistCount();
}

// Function to update wishlist count
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const wishlistCount = document.getElementById("wishlistCount");
    
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
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

// Initialize counters when document is ready
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistCount();
    updateCartCount();
}); 
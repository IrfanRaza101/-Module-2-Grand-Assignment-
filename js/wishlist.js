// Function to display wishlist items
function displayWishlist() {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const container = document.getElementById("wishlistItems");
    
    if (!container) return;

    if (wishlistItems.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fa fa-heart text-primary mb-4" style="font-size: 4rem;"></i>
                <h3>Your wishlist is empty</h3>
                <p class="text-muted">Add items that you like to your wishlist</p>
                <a href="product.html" class="btn btn-primary rounded-pill px-4 py-2">Continue Shopping</a>
            </div>
        `;
        return;
    }

    let wishlistHTML = '';
    wishlistItems.forEach((item, index) => {
        wishlistHTML += `
            <div class="cart-item bg-white p-3 mb-3 cart-animation" style="animation-delay: ${index * 0.1}s">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.img}" alt="${item.name}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="text-primary mb-0">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="col-md-6">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-primary" onclick="moveToCart(${index})">
                                <i class="fa fa-shopping-cart me-2"></i>Add to Cart
                            </button>
                            <button class="btn btn-danger" onclick="removeFromWishlist(${index})">
                                <i class="fa fa-trash me-2"></i>Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = wishlistHTML;
}

// Function to remove item from wishlist
function removeFromWishlist(index) {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    if (!wishlistItems[index]) return;

    const removedItem = wishlistItems[index];
    wishlistItems.splice(index, 1);
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    displayWishlist();
    updateWishlistCount();
    showToast(`${removedItem.name} removed from wishlist!`);
}

// Function to move item from wishlist to cart
function moveToCart(index) {
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    if (!wishlistItems[index]) return;

    const item = wishlistItems[index];
    item.quantity = 1;
    cartItems.push(item);
    
    // Remove from wishlist
    wishlistItems.splice(index, 1);
    
    // Update storage
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
    // Update UI
    displayWishlist();
    updateWishlistCount();
    updateCartCount();
    showToast(`${item.name} added to cart!`);
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
    displayWishlist();
    updateWishlistCount();
    updateCartCount();
}); 
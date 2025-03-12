// Function to update navbar with wishlist and cart functionality
function updateNavbar() {
    const navbarIcons = document.querySelector('.d-none.d-lg-flex.ms-2');
    if (!navbarIcons) return;

    navbarIcons.innerHTML = `
        <a class="btn-sm-square bg-white rounded-circle ms-3" href="">
            <small class="fa fa-search text-body"></small>
        </a>
        <a class="btn-sm-square bg-white rounded-circle ms-3" href="">
            <small class="fa fa-user text-body"></small>
        </a>
        <a class="btn-sm-square bg-white rounded-circle ms-3 position-relative" href="wishlist.html">
            <small class="fa fa-heart text-body"></small>
            <span id="wishlistCount" class="cart-counter">0</span>
        </a>
        <a class="btn-sm-square bg-white rounded-circle ms-3 position-relative" href="Cart.html">
            <small class="fa fa-shopping-bag text-body"></small>
            <span id="cartCount" class="cart-counter">0</span>
        </a>
        <a class="btn-sm-square bg-white rounded-circle ms-3" href="login.html" onclick="logout()">
            <small class="fa fa-sign-out-alt text-body"></small>
        </a>
    `;

    // Update counters
    updateWishlistCount();
    updateCartCount();
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', updateNavbar);
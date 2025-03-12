// Global Variables
let quantity = 1;

// Function to get query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get("name"),
        price: parseFloat(params.get("price")),
        img: params.get("img"),
        desc: params.get("desc"),
    };
}

// Load product details dynamically
function loadProductDetails() {
    const product = getQueryParams();
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const isInWishlist = wishlistItems.some(item => item.name === product.name);
    
    document.getElementById("product-name").textContent = product.name || "Product Name";
    document.getElementById("product-img").src = product.img || "img/default-product.jpg";
    document.getElementById("base-price").textContent = `$${product.price || 0}`;
    document.getElementById("product-desc").textContent = product.desc || "No description available.";
    
    // Update wishlist button state
    const wishlistBtn = document.getElementById('wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.innerHTML = `<i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>`;
        wishlistBtn.classList.toggle('active', isInWishlist);
    }
    
    updateTotalPrice(); // Initialize total price
}

// Quantity Management
function updateQuantity(change) {
    quantity = Math.max(1, quantity + change);
    const quantityElements = document.querySelectorAll('#quantity-value');
    quantityElements.forEach(el => el.textContent = quantity);
    updateTotalPrice();
}

// Restore quantity management and hide total price display
function updateTotalPrice() {
    const basePriceText = document.getElementById('base-price').textContent;
    const basePrice = parseFloat(basePriceText.replace('$', ''));
    // Hide total price calculation
    // const total = (basePrice * quantity).toFixed(2);
    // document.getElementById('total-price').textContent = total;
}

// Image Zoom Functionality
function initImageZoom() {
    const container = document.querySelector('.product-img-container');
    const img = document.querySelector('.product-img');
    
    if (!container || !img) return;

    container.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
    });

    container.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.5)';
    });

    container.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.transformOrigin = 'center center';
    });
}

// Cart Management
function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    document.getElementById("cartCount").textContent = cartItems.length;
}

function addToCart() {
    const product = getQueryParams();
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    // Create consistent product object
    const newProduct = {
        name: product.name,
        price: parseFloat(product.price),
        img: product.img || `img/product-${(cartItems.length % 8) + 1}.jpg`,
        quantity: quantity // quantity is already defined globally
    };
    
    cartItems.push(newProduct);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCounter();
    addToCartAnimation();
    showToast('Added to Cart!');
}

// Wishlist Functionality
function toggleWishlist() {
    const product = getQueryParams();
    const wishlistBtn = document.getElementById('wishlist-btn');
    if (!wishlistBtn) return;
    
    const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const existingIndex = wishlistItems.findIndex(item => item.name === product.name);
    
    if (existingIndex !== -1) {
        // Remove from wishlist
        wishlistItems.splice(existingIndex, 1);
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        wishlistBtn.classList.remove('active');
        showToast('Removed from Wishlist!');
    } else {
        // Add to wishlist
        wishlistItems.push({
            name: product.name,
            price: parseFloat(product.price),
            img: product.img
        });
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        wishlistBtn.classList.add('active');
        showToast('Added to Wishlist!');
    }
    
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    updateWishlistCount();
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Add to Cart Animation
function addToCartAnimation() {
    const btn = document.getElementById('add-to-cart');
    if (!btn) return;

    btn.classList.add('adding');
    showToast('Added to Cart!');
    
    setTimeout(() => {
        btn.classList.remove('adding');
    }, 1500);
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    initImageZoom();
    updateCartCounter();
    
    // Add event listeners
    const decreaseBtn = document.getElementById('quantity-decrease');
    const increaseBtn = document.getElementById('quantity-increase');
    const wishlistBtn = document.getElementById('wishlist-btn');
    const addToCartBtn = document.getElementById('add-to-cart');
    
    if (decreaseBtn) decreaseBtn.addEventListener('click', () => updateQuantity(-1));
    if (increaseBtn) increaseBtn.addEventListener('click', () => updateQuantity(1));
    if (wishlistBtn) wishlistBtn.addEventListener('click', toggleWishlist);
    if (addToCartBtn) addToCartBtn.addEventListener('click', addToCart);
});
(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(window).width() < 992) {
      if ($(this).scrollTop() > 45) {
        $(".fixed-top").addClass("bg-white shadow");
      } else {
        $(".fixed-top").removeClass("bg-white shadow");
      }
    } else {
      if ($(this).scrollTop() > 45) {
        $(".fixed-top").addClass("bg-white shadow").css("top", -45);
      } else {
        $(".fixed-top").removeClass("bg-white shadow").css("top", 0);
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    margin: 25,
    loop: true,
    center: true,
    dots: false,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
})(jQuery);

function addToCart(productName, productPrice, productImg) {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    // Create consistent product object
    const product = {
        name: productName,
        price: productPrice,
        img: productImg || `img/product-${(cart.length % 8) + 1}.jpg`,
        quantity: 1
    };
    
    cart.push(product);
    localStorage.setItem("cartItems", JSON.stringify(cart));
    updateCartCount();
    showToast('Added to Cart!');
}

// Function to update cart count in the UI
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartCountElement = document.getElementById("cartCount");

  // Update cart count dynamically
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}

// Update cart count on page load
updateCartCount();

function logout() {
    // Clear any stored user data
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    
    // Redirect to login page
    window.location.href = 'login.html';
    
    // Prevent back button after logout
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, null, window.location.href);
    };
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH61fcpBf9qZ15Alhpy-hSonzZ1ykOX3Q",
  authDomain: "fb-project-27629.firebaseapp.com",
  projectId: "fb-project-27629",
  storageBucket: "fb-project-27629.firebasestorage.app",
  messagingSenderId: "422532765330",
  appId: "1:422532765330:web:b62465831e637d5acbb84b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Products collection reference
const productsRef = db.collection('products');

// Function to add new product
async function addNewProduct(productData) {
    try {
        await productsRef.add({
            name: productData.name,
            price: productData.price,
            image: productData.image,
            description: productData.description,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('Product added successfully!');
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product!');
    }
}

// Function to update product
async function updateProduct(productId, productData) {
    try {
        await productsRef.doc(productId).update({
            name: productData.name,
            price: productData.price,
            image: productData.image,
            description: productData.description,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('Product updated successfully!');
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product!');
    }
}

// Function to delete product
async function deleteProduct(productId) {
    try {
        await productsRef.doc(productId).delete();
        alert('Product deleted successfully!');
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product!');
    }
}

// Function to get all products
async function getAllProducts() {
    try {
        const snapshot = await productsRef.get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}

// Display products from Firebase
async function displayProducts() {
    try {
        const products = await getAllProducts();
        const container = document.getElementById('productsContainer');
        if (!container) return;
        
        container.innerHTML = '';

        products.forEach((product, index) => {
            const delay = (index * 0.2).toFixed(1);
            
            const productHTML = `
                <div class="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="${delay}s">
                    <div class="product-item">
                        <div class="position-relative bg-light overflow-hidden">
                            <img class="img-fluid w-100" src="${product.image}" alt="${product.name}">
                            <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
                                New
                            </div>
                        </div>
                        <div class="text-center p-4">
                            <a class="d-block h5 mb-2" href="">${product.name}</a>
                            <span class="text-primary me-1">$${product.price}</span>
                            <span class="text-body text-decoration-line-through">$${(product.price * 1.5).toFixed(2)}</span>
                        </div>
                        <div class="d-flex border-top">
                            <small class="w-50 text-center border-end py-2">
                                <a class="text-body" href="detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&img=${encodeURIComponent(product.image)}&desc=${encodeURIComponent(product.description)}">
                                    <i class="fa fa-eye text-primary me-2"></i>View detail
                                </a>
                            </small>
                            <small class="w-50 text-center py-2">
                                <a class="text-body" href="javascript:void(0);" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
                                    <i class="fa fa-shopping-bag text-primary me-2"></i>Add to cart
                                </a>
                            </small>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productHTML;
        });

    } catch (error) {
        console.error('Error displaying products:', error);
    }
}

// Call displayProducts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    displayProducts();
    updateCartCount();
    updateWishlistCount();
});

// Function to add existing products to Firebase
async function addExistingProducts() {
    const products = [
        // Existing products
        {
            name: "Fresh Tomato",
            price: 19.00,
            image: "img/product-1.jpg",
            description: "Fresh Tomatoes from Organic Farms"
        },
        {
            name: "Fresh Pineapple",
            price: 15.00,
            image: "img/product-2.jpg",
            description: "Fresh Pineapple from Organic Farms"
        },
        {
            name: "Fresh Chilli",
            price: 10.00,
            image: "img/product-3.jpg",
            description: "Fresh Chilli for spicy dishes"
        },
        {
            name: "Fresh Strowbarry",
            price: 25.00,
            image: "img/product-4.jpg",
            description: "Fresh Strawberries for desserts"
        },
        {
            name: "Fresh Cucumber",
            price: 17.00,
            image: "img/product-5.jpg",
            description: "Cool Cucumber for salads"
        },
        {
            name: "Fresh Persimmon",
            price: 22.00,
            image: "img/product-6.jpg",
            description: "Sweet Persimmons to enjoy"
        },
        {
            name: "Fresh Potato",
            price: 10.00,
            image: "img/product-7.jpg",
            description: "Nutritious Potatoes for cooking"
        },
        {
            name: "Fresh Banana",
            price: 25.00,
            image: "img/product-8.jpg",
            description: "Sweet Bananas for energy"
        },
        // New additional fruits
        {
            name: "Fresh Apple",
            price: 18.00,
            image: "img/product-1.jpg",
            description: "Sweet and juicy apples from local farms"
        },
        {
            name: "Fresh Orange",
            price: 20.00,
            image: "img/product-2.jpg",
            description: "Vitamin C rich fresh oranges"
        },
        {
            name: "Fresh Mango",
            price: 30.00,
            image: "img/product-3.jpg",
            description: "Sweet and ripe mangoes"
        },
        {
            name: "Fresh Grapes",
            price: 15.00,
            image: "img/product-4.jpg",
            description: "Fresh and juicy grapes"
        },
        {
            name: "Fresh Watermelon",
            price: 25.00,
            image: "img/product-5.jpg",
            description: "Refreshing watermelons"
        },
        {
            name: "Fresh Peach",
            price: 22.00,
            image: "img/product-6.jpg",
            description: "Sweet and soft peaches"
        },
        {
            name: "Fresh Pomegranate",
            price: 28.00,
            image: "img/product-7.jpg",
            description: "Healthy pomegranates"
        },
        {
            name: "Fresh Kiwi",
            price: 24.00,
            image: "img/product-8.jpg",
            description: "Fresh and tangy kiwis"
        }
    ];

    try {
        for (const product of products) {
            await productsRef.add({
                ...product,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Product added:', product.name);
        }
        alert('All products added successfully!');
    } catch (error) {
        console.error('Error adding products:', error);
        alert('Error adding products!');
    }
}

// Call this function once to add all products
// addExistingProducts();

// Admin Panel Functions
async function addNewProductAdmin() {
    const name = prompt("Enter product name:");
    if (!name) return;

    const price = parseFloat(prompt("Enter product price:"));
    if (isNaN(price)) {
        alert("Invalid price!");
        return;
    }

    const image = prompt("Enter product image path (e.g., img/product-1.jpg):");
    if (!image) return;

    const description = prompt("Enter product description:");
    if (!description) return;

    try {
        await addNewProduct({
            name: name,
            price: price,
            image: image,
            description: description
        });
        displayProducts(); // Refresh products display
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product!');
    }
}

async function updateProductAdmin(productId) {
    const products = await getAllProducts();
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert("Product not found!");
        return;
    }

    const updateData = {};
    
    // Name update
    const name = prompt("Enter new name (or press Cancel to skip):", product.name);
    if (name !== null) {
        updateData.name = name;
    }

    // Price update
    const price = prompt("Enter new price (or press Cancel to skip):", product.price);
    if (price !== null) {
        const newPrice = parseFloat(price);
        if (!isNaN(newPrice)) {
            updateData.price = newPrice;
        }
    }

    // Image update
    const image = prompt("Enter new image path (or press Cancel to skip):", product.image);
    if (image !== null) {
        updateData.image = image;
    }

    // Description update
    const description = prompt("Enter new description (or press Cancel to skip):", product.description);
    if (description !== null) {
        updateData.description = description;
    }

    if (Object.keys(updateData).length > 0) {
        try {
            await updateProduct(productId, updateData);
            displayProducts(); // Refresh products display
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product!');
        }
    } else {
        alert('No changes were made to the product.');
    }
}

async function deleteProductAdmin(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            await deleteProduct(productId);
            displayProducts(); // Refresh products display
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product!');
        }
    }
}

// Function to show admin panel
function showAdminPanel() {
    const adminButtons = document.querySelectorAll('.admin-buttons');
    adminButtons.forEach(button => {
        button.style.display = 'flex';
    });

    // Remove existing admin panel if any
    const existingPanel = document.querySelector('.admin-panel');
    if (existingPanel) {
        existingPanel.remove();
    }

    // Add new admin panel
    const adminHTML = `
        <div class="admin-panel" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
            <div class="card" style="width: 300px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Admin Panel</h5>
                </div>
                <div class="card-body">
                    <button class="btn btn-success w-100 mb-2" onclick="addNewProductAdmin()">
                        <i class="fa fa-plus"></i> Add New Product
                    </button>
                    <button class="btn btn-secondary w-100" onclick="hideAdminPanel()">
                        <i class="fa fa-times"></i> Hide Admin Buttons
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', adminHTML);
}

// New function to hide admin buttons
function hideAdminPanel() {
    const adminButtons = document.querySelectorAll('.admin-buttons');
    adminButtons.forEach(button => {
        button.style.display = 'none';
    });

    const existingPanel = document.querySelector('.admin-panel');
    if (existingPanel) {
        existingPanel.remove();
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

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    const wishlistCount = document.getElementById("wishlistCount");
    
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}



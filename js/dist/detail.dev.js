"use strict";

// Function to get query parameters
function getQueryParams() {
  var params = new URLSearchParams(window.location.search);
  return {
    name: params.get("name"),
    price: parseFloat(params.get("price")),
    img: params.get("img"),
    desc: params.get("desc")
  };
} // Load product details dynamically


var product = getQueryParams();
document.getElementById("product-name").textContent = product.name || "Product Name";
document.getElementById("product-img").src = product.img || "img/default-product.jpg";
document.getElementById("product-price").textContent = "$".concat(product.price || 0);
document.getElementById("product-desc").textContent = product.desc || "No description available."; // Function to update the cart counter

function updateCartCounter() {
  var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  document.getElementById("cartCount").textContent = cartItems.length;
} // Add to Cart Functionality


document.getElementById("add-to-cart").addEventListener("click", function () {
  var cartItems = JSON.parse(localStorage.getItem("cartItems")) || []; // Get existing cart from localStorage

  cartItems.push(product); // Add the current product to the cart

  localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Save updated cart

  updateCartCounter(); // Update the cart counter after adding
}); // Function to remove item from cart

function removeFromCart(index) {
  var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems.splice(index, 1); // Remove item from array

  localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Update localStorage

  updateCartUI(); // Re-render the cart

  updateCartCounter(); // Update the cart counter after removing
} // Initialize the cart UI and counter on page load


document.addEventListener("DOMContentLoaded", function () {
  updateCartCounter();
  updateCartUI();
});
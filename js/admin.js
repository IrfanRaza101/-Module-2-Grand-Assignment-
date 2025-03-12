// Check if user is logged in and is admin
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.email !== 'irfanraz67@gmail.com') {
        showToast('Access Denied! Only admin can access this page.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
});

// Add Product Form Handler
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value
    };

    try {
        await addNewProduct(productData);
        document.getElementById('addProductForm').reset();
        loadProducts(); // Refresh products list
        showToast('Product added successfully!');
    } catch (error) {
        console.error('Error adding product:', error);
        showToast('Error adding product!');
    }
});

// Load Products in Table
async function loadProducts() {
    try {
        const products = await getAllProducts();
        const tableBody = document.getElementById('productsTableBody');
        tableBody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td>${product.description}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="editProduct('${product.id}')">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProductAdmin('${product.id}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products!');
    }
}

// Edit Product Function
async function editProduct(productId) {
    const products = await getAllProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showToast('Product not found!');
        return;
    }

    // Create modal for editing
    const modalHTML = `
        <div class="modal fade" id="editProductModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editProductForm">
                            <div class="mb-3">
                                <label class="form-label">Product Name</label>
                                <input type="text" class="form-control" id="editProductName" value="${product.name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Price</label>
                                <input type="number" class="form-control" id="editProductPrice" value="${product.price}" step="0.01" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Image URL</label>
                                <input type="text" class="form-control" id="editProductImage" value="${product.image}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <input type="text" class="form-control" id="editProductDescription" value="${product.description}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveProductEdit('${productId}')">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('editProductModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

// Save Product Edit
async function saveProductEdit(productId) {
    const updateData = {
        name: document.getElementById('editProductName').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        image: document.getElementById('editProductImage').value,
        description: document.getElementById('editProductDescription').value
    };

    try {
        await updateProduct(productId, updateData);
        bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        loadProducts(); // Refresh products list
        showToast('Product updated successfully!');
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Error updating product!');
    }
}

// Delete Product Function
async function deleteProductAdmin(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await deleteProduct(productId);
            loadProducts(); // Refresh products list
            showToast('Product deleted successfully!');
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('Error deleting product!');
        }
    }
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
}); 
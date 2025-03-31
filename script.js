// Product Data
let products = [
    {
        id: 1,
        name: "Premium Whole Cashews",
        price: 15.99,
        image: "https://images.pexels.com/photos/1512233/pexels-photo-1512233.jpeg",
        description: "Hand-selected whole cashews, lightly salted for perfect flavor."
    },
    {
        id: 2,
        name: "Organic Raw Cashews",
        price: 18.50,
        image: "https://images.pexels.com/photos/4202924/pexels-photo-4202924.jpeg",
        description: "100% organic, raw cashews with no additives or preservatives."
    },
    {
        id: 3,
        name: "Roasted & Salted Cashews",
        price: 12.99,
        image: "https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg",
        description: "Perfectly roasted cashews with just the right amount of sea salt."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();
    
    // Check if we're on the cart page
    if (document.getElementById('cart-items')) {
        renderCart();
    }
    
    // Check if we're on the product details page
    if (document.getElementById('product-details')) {
        loadProductDetails();
    }
    
    // Check if we're on the admin page
    if (document.getElementById('admin-products')) {
        renderAdminProducts();
        setupAdminForm();
    }
});

// Render products on the home page
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => `
        <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                    Add to Cart
                </button>
                <a href="product.html?id=${product.id}" class="block text-center mt-2 text-blue-600 hover:underline">View Details</a>
            </div>
        </div>
    `).join('');
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added to cart`);
}

// Update cart count in header
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Render cart items
function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsElement) return;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p class="text-center py-8">Your cart is empty</p>';
        if (cartTotalElement) cartTotalElement.textContent = '0.00';
        return;
    }

    cartItemsElement.innerHTML = cart.map(item => `
        <div class="flex items-center border-b border-gray-200 py-4">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
            <div class="ml-4 flex-grow">
                <h3 class="font-medium">${item.name}</h3>
                <p class="text-gray-600">$${item.price.toFixed(2)}</p>
            </div>
            <div class="flex items-center">
                <button onclick="updateQuantity(${item.id}, -1)" class="px-2 py-1 bg-gray-200 rounded-l">-</button>
                <span class="px-4">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="px-2 py-1 bg-gray-200 rounded-r">+</button>
                <button onclick="removeFromCart(${item.id})" class="ml-4 text-red-500">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    if (cartTotalElement) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = total.toFixed(2);
    }
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
    showToast('Item removed from cart');
}

// Load product details page
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    const productDetails = document.getElementById('product-details');

    if (!product || !productDetails) {
        window.location.href = 'index.html';
        return;
    }

    productDetails.innerHTML = `
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 md:h-96 object-cover">
            <div class="p-6">
                <h1 class="text-2xl font-bold mb-2">${product.name}</h1>
                <p class="text-green-600 text-xl font-semibold mb-4">$${product.price.toFixed(2)}</p>
                <p class="text-gray-700 mb-6">${product.description}</p>
                <button onclick="addToCart(${product.id})" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
                    Add to Cart
                </button>
                <a href="index.html" class="block text-center mt-4 text-blue-600 hover:underline">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Products
                </a>
            </div>
        </div>
    `;
}

// Admin functions
function renderAdminProducts() {
    const adminProductsElement = document.getElementById('admin-products');
    if (!adminProductsElement) return;

    adminProductsElement.innerHTML = products.map(product => `
        <tr class="border-b">
            <td class="py-4 px-4">
                <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
            </td>
            <td class="py-4 px-4">${product.name}</td>
            <td class="py-4 px-4">$${product.price.toFixed(2)}</td>
            <td class="py-4 px-4">
                <button onclick="editProduct(${product.id})" class="text-blue-500 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct(${product.id})" class="text-red-500">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function setupAdminForm() {
    const form = document.getElementById('product-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('product-id').value) || Date.now();
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const image = document.getElementById('product-image').value;
        const description = document.getElementById('product-description').value;

        if (!name || !price || !image) {
            alert('Please fill in all required fields');
            return;
        }

        const existingIndex = products.findIndex(p => p.id === id);
        if (existingIndex >= 0) {
            // Update existing product
            products[existingIndex] = { id, name, price, image, description };
        } else {
            // Add new product
            products.push({ id, name, price, image, description });
        }

        renderAdminProducts();
        form.reset();
        document.getElementById('product-id').value = '';
        showToast('Product saved successfully');
    });
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        renderAdminProducts();
        showToast('Product deleted');
    }
}
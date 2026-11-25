// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
    
    // Event listeners
    cartIcon.addEventListener('click', toggleCart);
    closeBtn.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', goToCheckout);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            toggleCart();
        }
    });
});

// Display products on the page
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card', 'glow-effect', 'slide-up');
        
        let badgeHTML = '';
        if (product.badge) {
            badgeHTML = `<div class="product-badge">${product.badge}</div>`;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${badgeHTML}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
        
        // Add event listener to the add to cart button
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', () => addToCart(product));
    });
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
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
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartCount();
    displayCartItems();
    
    // Show cart modal
    cartModal.style.display = 'block';
}

// Display cart items
function displayCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide.</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">×</button>
        `;
        
        cartItems.appendChild(cartItem);
        
        // Add event listeners for quantity buttons and remove button
        const decreaseBtn = cartItem.querySelector('.decrease');
        const increaseBtn = cartItem.querySelector('.increase');
        const removeBtn = cartItem.querySelector('.cart-item-remove');
        
        decreaseBtn.addEventListener('click', () => updateQuantity(item.id, -1));
        increaseBtn.addEventListener('click', () => updateQuantity(item.id, 1));
        removeBtn.addEventListener('click', () => removeFromCart(item.id));
        
        // Calculate total
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = formatPrice(total);
}

// Update item quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            displayCartItems();
            updateCartCount();
        }
    }
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    displayCartItems();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Toggle cart modal
function toggleCart() {
    if (cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
    } else {
        displayCartItems();
        cartModal.style.display = 'block';
    }
}

// Go to checkout page
function goToCheckout() {
    if (cart.length === 0) {
        alert('Votre panier est vide. Ajoutez des produits avant de passer à la caisse.');
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Format price with FCFA
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price);
}
// DOM Elements
const checkoutItems = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutForm = document.getElementById('checkout-form');
const orderDataInput = document.getElementById('order-data');
const cartCount = document.getElementById('cart-count');

// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();
    updateCartCount();
    
    // Le formulaire est envoyé normalement à order.php (qui redirige vers le suivi) :
    // pas d'envoi en fetch, et pas d'erreur si l'élément n'existe pas
    if (checkoutForm) checkoutForm.addEventListener('submit', processOrder);
});

// Display checkout items
function displayCheckoutItems() {
    checkoutItems.innerHTML = '';
    
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p>Votre panier est vide. <a href="index.html">Retourner à la boutique</a></p>';
        checkoutTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.classList.add('checkout-item');
        
        checkoutItem.innerHTML = `
            <div class="checkout-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="checkout-item-details">
                <h4 class="checkout-item-name">${item.name}</h4>
                <div class="checkout-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="checkout-item-quantity">x${item.quantity}</div>
        `;
        
        checkoutItems.appendChild(checkoutItem);
        
        // Calculate total
        total += item.price * item.quantity;
    });
    
    checkoutTotal.textContent = formatPrice(total);
    
    // Store order data in hidden input
    orderDataInput.value = JSON.stringify(cart);
}

// Process order submission
function processOrder(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Votre panier est vide. Ajoutez des produits avant de passer à la caisse.');
        return;
    }
    
    // Get form data
    const formData = new FormData(checkoutForm);
    
    // Send order data to server
    fetch('order.html', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur de réponse du serveur : ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Commande réussie !');
        } else {
            throw new Error(data.message || 'Erreur inconnue');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.');
    });
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Format price with FCFA
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CFA' }).format(price);
}
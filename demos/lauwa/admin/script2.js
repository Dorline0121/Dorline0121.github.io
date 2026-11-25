
// Variables globales
let currentDeleteButton; // Variable pour stocker le bouton actuellement cliqué
let allProducts = [];
let allClients = [];
let allSuppliers = [];
let allOrders = [];
let allDeliveries = [];

// Fonction pour afficher un toast de notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`;
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Supprimer automatiquement après 3 secondes
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Fonctions d'initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du mode sombre
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
    });
    
    // Gestion du menu mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    });
    
    overlay.addEventListener('click', function() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    });
    
    // Navigation entre les sections
    const menuButtons = document.querySelectorAll('.menu-btn');
    const sections = document.querySelectorAll('.section-content');
    
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Désactiver tous les boutons et masquer toutes les sections
            menuButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-primary', 'bg-opacity-10', 'text-primary', 'neon-border');
                btn.classList.add('hover:bg-gray-100', 'dark:hover:bg-dark-100');
            });
            
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Activer le bouton cliqué et afficher la section correspondante
            this.classList.add('active', 'bg-primary', 'bg-opacity-10', 'text-primary', 'neon-border');
            this.classList.remove('hover:bg-gray-100', 'dark:hover:bg-dark-100');
            
            document.getElementById(`${targetSection}-section`).classList.remove('hidden');
            
            // Fermer le menu mobile
            if (window.innerWidth < 1024) {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        });
    });
    
    // Initialiser les graphiques
    initCharts();
    
    // Initialiser les gestionnaires de modales
    initModalHandlers();
    
    // Initialiser les filtres et recherches
    initFiltersAndSearch();
    
    // Initialiser les fonctionnalités d'exportation
    initExportFeatures();
    
    // Recherche globale
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                // Implémentez la recherche globale ici
                showToast(`Recherche de "${this.value}" en cours...`, 'info');
                
                // Simuler un résultat de recherche
                setTimeout(() => {
                    showToast(`Résultats trouvés pour "${this.value}"`, 'success');
                }, 1000);
            }
        });
    }
    
    // Impression de facture
    document.getElementById('print-button').addEventListener('click', printInvoice);
    
    // Gestion de l'affichage des produits (grille/liste)
    const viewToggleButtons = document.querySelectorAll('.view-toggle-btn');
    const productsGrid = document.getElementById('products-grid');
    const productsList = document.getElementById('products-list');
    
    viewToggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            
            // Mettre à jour les boutons
            viewToggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour l'affichage
            if (viewType === 'grid') {
                productsGrid.classList.remove('hidden');
                productsList.classList.add('hidden');
            } else {
                productsGrid.classList.add('hidden');
                productsList.classList.remove('hidden');
            }
        });
    });
});

// Initialisation des graphiques
function initCharts() {
    // Graphique des ventes mensuelles
    const salesChartCtx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(salesChartCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
            datasets: [{
                label: 'Ventes (FCFA)',
                data: [4800000, 5200000, 4900000, 6500000, 6100000, 7800000, 8200000, 8500000],
                borderColor: '#29ADE4',
                backgroundColor: 'rgba(41, 173, 228, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += new Intl.NumberFormat('fr-FR').format(context.raw) + ' FCFA';
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value / 1000000 + 'M';
                        }
                    }
                }
            }
        }
    });
    
    // Graphique des produits les plus vendus
    const productsChartCtx = document.getElementById('productsChart').getContext('2d');
    const productsChart = new Chart(productsChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Câbles électriques', 'Disjoncteurs', 'Batteries industrielles', 'Transformateurs', 'Autres'],
            datasets: [{
                data: [35, 25, 15, 10, 15],
                backgroundColor: [
                    '#29ADE4',
                    '#4FD1C5',
                    '#F6AD55',
                    '#FC8181',
                    '#B794F4'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    
    // Graphique des fournisseurs
    const suppliersChartCtx = document.getElementById('suppliersChart');
    if (suppliersChartCtx) {
        const suppliersChart = new Chart(suppliersChartCtx, {
            type: 'bar',
            data: {
                labels: ['Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août'],
                datasets: [
                    {
                        label: 'TechImport Sarl',
                        data: [800000, 1200000, 950000, 1500000, 1800000, 3000000],
                        backgroundColor: '#29ADE4'
                    },
                    {
                        label: 'ElectroPower Inc',
                        data: [600000, 800000, 1100000, 900000, 1300000, 1850000],
                        backgroundColor: '#F6AD55'
                    },
                    {
                        label: 'AfricaBuild Ltd',
                        data: [300000, 400000, 500000, 450000, 600000, 550000],
                        backgroundColor: '#4FD1C5'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat('fr-FR').format(context.raw) + ' FCFA';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value / 1000000 + 'M';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Gestionnaires de modales
function initModalHandlers() {
    // Fonction générique pour ouvrir/fermer les modales
    function toggleModal(modalId, show = true) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (show) {
                modal.classList.remove('hidden');
            } else {
                modal.classList.add('hidden');
            }
        }
    }
    
    // Fermer les modales avec les boutons de fermeture
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('[id$="-modal"]');
            if (modal) {
                toggleModal(modal.id, false);
            }
        });
    });
    
    // Fermer les modales en cliquant en dehors
    document.querySelectorAll('[id$="-modal"]').forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                toggleModal(this.id, false);
            }
        });
    });
    
    // Boutons d'ouverture des modales
    
    // Commandes
    document.getElementById('add-commande-btn').addEventListener('click', function() {
        document.getElementById('commande-modal-title').textContent = 'Nouvelle Commande';
        document.getElementById('commande-edit-mode').value = 'false';
        document.getElementById('commande-form').reset();
        document.getElementById('commande-id').value = '';
        
        // Générer une nouvelle référence
        const today = new Date();
        const year = today.getFullYear();
        const nextId = Math.floor(Math.random() * 1000) + 1543; // Simuler un nouvel ID
        document.getElementById('commande-reference').value = `#CMD-${year}-${nextId}`;
        
        // Définir la date du jour
        document.getElementById('commande-date').value = today.toISOString().split('T')[0];
        
        // Date de livraison par défaut (aujourd'hui + 7 jours)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        document.getElementById('commande-delivery-date').value = deliveryDate.toISOString().split('T')[0];
        
        toggleModal('commande-modal', true);
    });
    
    // Produits
    document.getElementById('add-product-btn').addEventListener('click', function() {
        document.getElementById('product-modal-title').textContent = 'Nouveau Produit';
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        toggleModal('product-modal', true);
    });
    
    // Clients
    document.getElementById('add-client-btn').addEventListener('click', function() {
        document.getElementById('client-modal-title').textContent = 'Nouveau Client';
        document.getElementById('client-form').reset();
        document.getElementById('client-id').value = '';
        toggleModal('client-modal', true);
    });
    
    // Fournisseurs
    document.getElementById('add-supplier-btn').addEventListener('click', function() {
        document.getElementById('supplier-modal-title').textContent = 'Nouveau Fournisseur';
        document.getElementById('supplier-form').reset();
        document.getElementById('supplier-id').value = '';
        toggleModal('supplier-modal', true);
    });
    
    // Commander aux fournisseurs
    document.getElementById('add-supplier-order-btn').addEventListener('click', function() {
        document.getElementById('supplier-order-form').reset();
        
        // Générer une nouvelle référence
        const today = new Date();
        const year = today.getFullYear();
        const nextId = Math.floor(Math.random() * 100) + 90; // Simuler un nouvel ID
        document.getElementById('supplier-order-reference').value = `#SUP-${year}-${nextId}`;
        
        // Définir la date du jour
        document.getElementById('supplier-order-date').value = today.toISOString().split('T')[0];
        
        // Date de livraison par défaut (aujourd'hui + 14 jours)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 14);
        document.getElementById('supplier-order-delivery-date').value = deliveryDate.toISOString().split('T')[0];
        
        toggleModal('supplier-order-modal', true);
    });
    
    // Historique des entrées fournisseurs
    document.getElementById('view-suppliers-history-btn').addEventListener('click', function() {
        toggleModal('supplier-history-modal', true);
    });
    
    // Livraisons
    document.getElementById('add-delivery-btn').addEventListener('click', function() {
        toggleModal('new-delivery-modal', true);
    });
    
    // Toutes les factures
    document.getElementById('view-all-invoices-btn').addEventListener('click', function() {
        toggleModal('all-invoices-modal', true);
    });
    
    // Boutons de visualisation
    document.querySelectorAll('.view-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            // Simuler le chargement des données de commande
            document.getElementById('order-details-loader').style.display = 'flex';
            
            // Simuler un appel API
            setTimeout(() => {
                // Mise à jour des informations de commande
                document.getElementById('order-ref').textContent = `#CMD-2023-${orderId}`;
                
                // Masquer le loader
                document.getElementById('order-details-loader').style.display = 'none';
                
                // Afficher la modale
                toggleModal('commande-details-modal', true);
            }, 500);
        });
    });
    
    document.querySelectorAll('.view-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            
            // Afficher le loader
            document.getElementById('product-details-loader').style.display = 'flex';
            
            // Simuler un appel API
            setTimeout(() => {
                // Faire un appel AJAX pour récupérer les détails du produit
                fetch(`get_product.html?id=${productId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            // Remplir les détails du produit
                            document.getElementById('detail-product-name').textContent = data.nom;
                            document.getElementById('detail-product-ref').textContent = data.reference || '-';
                            document.getElementById('detail-product-category').textContent = data.categorie || '-';
                            document.getElementById('detail-product-description').textContent = data.description || 'Aucune description disponible';
                            document.getElementById('detail-product-price').textContent = `${new Intl.NumberFormat('fr-FR').format(data.prix_unitaire)} FCFA`;
                            document.getElementById('detail-product-unit').textContent = data.unite_mesure || 'Unité';
                            document.getElementById('detail-product-stock').textContent = `${data.stock_actuel} unités`;
                            document.getElementById('detail-product-alert').textContent = `${data.stock_alerte} unités`;
                            
                            // Image du produit
                            const productImage = document.getElementById('detail-product-image');
                            if (data.image) {
                                productImage.src = data.image;
                            } else {
                                productImage.src = 'https://via.placeholder.com/300x200?text=Pas+d%27image';
                            }
                            
                            // Statut du stock
                            const statusElement = document.getElementById('detail-product-status');
                            if (data.stock_actuel > data.stock_alerte) {
                                statusElement.textContent = 'En stock';
                                statusElement.className = 'px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm';
                            } else if (data.stock_actuel > 0) {
                                statusElement.textContent = 'Stock faible';
                                statusElement.className = 'px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm';
                            } else {
                                statusElement.textContent = 'Rupture de stock';
                                statusElement.className = 'px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm';
                            }
                        }
                        
                        // Masquer le loader
                        document.getElementById('product-details-loader').style.display = 'none';
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des détails du produit :', error);
                        document.getElementById('product-details-loader').style.display = 'none';
                        showToast('Erreur lors de la récupération des détails du produit', 'error');
                    });
                    
                // Afficher la modale
                toggleModal('product-details-modal', true);
            }, 300);
        });
    });
    
    // Modals livraison et facture
    document.querySelectorAll('.view-delivery-btn').forEach(button => {
        button.addEventListener('click', function() {
            const deliveryId = this.getAttribute('data-id');
            // Simuler le chargement des données de livraison
            document.getElementById('delivery-details-loader').style.display = 'flex';
            
            // Simuler un appel API
            setTimeout(() => {
                // Mise à jour des informations de livraison
                document.getElementById('delivery-details-ref').textContent = `#LIV-2023-${deliveryId}`;
                
                // Masquer le loader
                document.getElementById('delivery-details-loader').style.display = 'none';
                
                // Afficher la modale
                toggleModal('delivery-details-modal', true);
            }, 500);
        });
    });
    
    document.querySelectorAll('.view-invoice-btn').forEach(button => {
        button.addEventListener('click', function() {
            const invoiceId = this.getAttribute('data-id');
            // Mise à jour des informations de facture
            document.getElementById('invoice-number').textContent = `#FAC-2023-${invoiceId}`;
            
            // Afficher la facture
            document.getElementById('delivery-slip').classList.add('hidden');
            document.getElementById('invoice-preview').classList.remove('hidden');
        });
    });
    
    document.querySelectorAll('.view-supplier-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            // Simuler le chargement des données de commande fournisseur
            document.getElementById('supplier-order-details-loader').style.display = 'flex';
            
            // Simuler un appel API
            setTimeout(() => {
                // Mise à jour des informations de commande
                document.getElementById('supplier-order-details-ref').textContent = `#SUP-2023-${orderId}`;
                
                // Masquer le loader
                document.getElementById('supplier-order-details-loader').style.display = 'none';
                
                // Afficher la modale
                toggleModal('supplier-order-details-modal', true);
            }, 500);
        });
    });
    
    // Boutons d'édition
    document.querySelectorAll('.edit-order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            document.getElementById('commande-modal-title').textContent = 'Modifier la Commande';
            document.getElementById('commande-edit-mode').value = 'true';
            document.getElementById('commande-id').value = orderId;
            document.getElementById('commande-reference').value = `#CMD-2025-${orderId}`;
            
            // Simuler le chargement des données de la commande
            // Dans un cas réel, vous feriez une requête AJAX pour récupérer les données
            
            toggleModal('commande-modal', true);
        });
    });
    
    document.querySelectorAll('.edit-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            document.getElementById('product-modal-title').textContent = 'Modifier le Produit';
            document.getElementById('product-id').value = productId;
            
            // Faire un appel AJAX pour récupérer les détails du produit
            fetch(`get_product.html?id=${productId}`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        // Remplir le formulaire
                        document.getElementById('product-name').value = data.nom || '';
                        document.getElementById('product-category').value = data.categorie || '';
                        document.getElementById('product-reference').value = data.reference || '';
                        document.getElementById('product-price').value = data.prix_unitaire || 0;
                        document.getElementById('product-unit').value = data.unite_mesure || 'unit';
                        document.getElementById('product-stock').value = data.stock_actuel || 0;
                        document.getElementById('product-alert-stock').value = data.stock_alerte || 0;
                        document.getElementById('product-description').value = data.description || '';
                        document.getElementById('product-supplier').value = data.fournisseur_id || '';
                        document.getElementById('product-delivery-time').value = data.delai_livraison || 7;
                        document.getElementById('product-image').value = data.image || '';
                    }
                    
                    toggleModal('product-modal', true);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des détails du produit :', error);
                    showToast('Erreur lors de la récupération des détails du produit', 'error');
                });
        });
    });
    
    // Boutons d'export
    document.getElementById('export-dashboard-btn').addEventListener('click', function() {
        document.getElementById('export-modal-title').textContent = 'Exporter les données du Dashboard';
        document.getElementById('export-type').value = 'dashboard';
        toggleModal('export-data-modal', true);
    });
    
    document.getElementById('export-commandes-btn').addEventListener('click', function() {
        document.getElementById('export-modal-title').textContent = 'Exporter les Commandes';
        document.getElementById('export-type').value = 'commandes';
        toggleModal('export-data-modal', true);
    });
    
    document.getElementById('export-products-btn').addEventListener('click', function() {
        document.getElementById('export-modal-title').textContent = 'Exporter les Produits';
        document.getElementById('export-type').value = 'produits';
        toggleModal('export-data-modal', true);
    });
    
    document.getElementById('export-clients-btn').addEventListener('click', function() {
        document.getElementById('export-modal-title').textContent = 'Exporter les Clients';
        document.getElementById('export-type').value = 'clients';
        toggleModal('export-data-modal', true);
    });
    
    document.getElementById('export-suppliers-btn').addEventListener('click', function() {
        document.getElementById('export-modal-title').textContent = 'Exporter les Fournisseurs';
        document.getElementById('export-type').value = 'fournisseurs';
        toggleModal('export-data-modal', true);
    });
    
    document.getElementById('export-deliveries-btn').addEventListener('click', function() {
        document.getElementById('export-modal-title').textContent = 'Exporter les Livraisons';
        document.getElementById('export-type').value = 'livraisons';
        toggleModal('export-data-modal', true);
    });

    // Gestion des filtres dropdown
    const filterBtns = document.querySelectorAll('[id$="-filter-btn"]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dropdownId = this.id.replace('-btn', '-dropdown');
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                dropdown.classList.toggle('hidden');
            }
        });
    });

    // Fermer les dropdowns en cliquant en dehors
    document.addEventListener('click', function(event) {
        const filterBtns = document.querySelectorAll('[id$="-filter-btn"]');
        filterBtns.forEach(btn => {
            const dropdownId = btn.id.replace('-btn', '-dropdown');
            const dropdown = document.getElementById(dropdownId);
            
            if (dropdown && !dropdown.contains(event.target) && !btn.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        });
    });

    // Gérer le modal de suppression
    document.querySelectorAll('.delete-order-btn, .delete-icon').forEach(button => {
        button.addEventListener('click', function() {
            currentDeleteButton = this;
            const id = this.getAttribute('data-id');
            const type = this.classList.contains('delete-order-btn') ? 'commande' : 
                        this.closest('tr').classList.contains('client-row') ? 'client' : 
                        this.closest('tr').classList.contains('supplier-row') ? 'fournisseur' : 'produit';
            
            document.getElementById('delete-title').textContent = `Confirmer la suppression`;
            document.getElementById('delete-message').textContent = `Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`;
            
            toggleModal('delete-confirmation-modal', true);
        });
    });

    document.querySelector('.modal-close-btn').addEventListener('click', function() {
        toggleModal('delete-confirmation-modal', false);
    });

    document.getElementById('confirm-delete-btn').addEventListener('click', function() {
        const itemId = currentDeleteButton.getAttribute('data-id');
        
        // Simuler la suppression
        showToast('Élément supprimé avec succès', 'success');
        
        // Fermer le modal
        toggleModal('delete-confirmation-modal', false);
        
        // Supprimer visuellement l'élément
        const row = currentDeleteButton.closest('tr');
        if (row) {
            row.remove();
        }
    });

    // Gérer les boutons d'ajout/suppression de produits dans le formulaire de commande
    document.getElementById('add-commande-product').addEventListener('click', function() {
        const productsContainer = document.getElementById('commande-products');
        const productRow = productsContainer.querySelector('.product-row');
        
        if (productRow) {
            const newRow = productRow.cloneNode(true);
            const inputs = newRow.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.value = input.tagName === 'SELECT' ? '' : '1';
            });
            
            // Réinitialiser les prix
            newRow.querySelector('.product-price').textContent = '0 FCFA';
            newRow.querySelector('.product-total').textContent = '0 FCFA';
            
            // Ajouter les gestionnaires d'événements
            addProductRowEventListeners(newRow);
            
            productsContainer.appendChild(newRow);
            updateOrderTotal();
        }
    });

    // Ajouter des gestionnaires d'événements aux lignes de produits existantes
    document.querySelectorAll('.product-row').forEach(row => {
        addProductRowEventListeners(row);
    });

    // Ajouter des gestionnaires d'événements aux lignes de produits de commande fournisseur existantes
    document.getElementById('add-supplier-product').addEventListener('click', function() {
        const productsContainer = document.getElementById('supplier-product-body');
        const productRow = productsContainer.querySelector('.supplier-product-row');
        
        if (productRow) {
            const newRow = productRow.cloneNode(true);
            const inputs = newRow.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.value = input.tagName === 'SELECT' ? '' : (input.type === 'number' ? '1' : '0');
            });
            
            // Réinitialiser les prix
            newRow.querySelector('.supplier-product-total').textContent = '0 FCFA';
            
            // Ajouter les gestionnaires d'événements
            addSupplierProductRowEventListeners(newRow);
            
            productsContainer.appendChild(newRow);
            updateSupplierOrderTotal();
        }
    });

    document.querySelectorAll('.supplier-product-row').forEach(row => {
        addSupplierProductRowEventListeners(row);
    });

    // Gestion de l'adresse de livraison par défaut
    const useDefaultAddressCheckbox = document.getElementById('use-default-address');
    if (useDefaultAddressCheckbox) {
        useDefaultAddressCheckbox.addEventListener('change', function() {
            const addressInputs = document.querySelectorAll('#delivery-address, #delivery-city, #delivery-country, #delivery-contact-name, #delivery-contact-phone');
            
            addressInputs.forEach(input => {
                input.disabled = this.checked;
                if (this.checked) {
                    input.classList.add('bg-gray-100', 'dark:bg-dark-300');
                } else {
                    input.classList.remove('bg-gray-100', 'dark:bg-dark-300');
                }
            });
            
            if (this.checked) {
                // Simuler le remplissage des champs avec l'adresse du client sélectionné
                const clientSelect = document.getElementById('delivery-order');
                if (clientSelect.value) {
                    // Dans un cas réel, vous récupéreriez l'adresse du client depuis la base de données
                    document.getElementById('delivery-address').value = 'Adresse du client sélectionné';
                    document.getElementById('delivery-city').value = 'Ville du client';
                    document.getElementById('delivery-country').value = 'Cameroun';
                    document.getElementById('delivery-contact-name').value = 'Contact du client';
                    document.getElementById('delivery-contact-phone').value = '+237 6XX XX XX XX';
                }
            }
        });
    }

    // Gestion du changement de commande pour la livraison
    const deliveryOrderSelect = document.getElementById('delivery-order');
    if (deliveryOrderSelect) {
        deliveryOrderSelect.addEventListener('change', function() {
            const productsContainer = document.getElementById('delivery-products-container');
            
            if (this.value) {
                // Simuler le chargement des produits de la commande
                productsContainer.innerHTML = '<div class="flex justify-center py-4"><div class="loader"></div></div>';
                
                // Simuler un délai de chargement
                setTimeout(() => {
                    // Dans un cas réel, vous récupéreriez les produits de la commande depuis la base de données
                    productsContainer.innerHTML = `
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-100">
                            <thead class="bg-gray-50 dark:bg-dark-100">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produit</th>
                                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantité</th>
                                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">À livrer</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-dark-100">
                                <tr>
                                    <td class="px-4 py-3 text-sm">
                                        <p class="font-medium">Câbles électriques haute tension</p>
                                        <p class="text-gray-500 dark:text-gray-400">Ref: CABLE-HT-10MM</p>
                                    </td>
                                    <td class="px-4 py-3 text-center text-sm">15</td>
                                    <td class="px-4 py-3 text-center text-sm">
                                        <input type="number" min="0" max="15" value="15" class="w-16 rounded-lg border border-gray-300 dark:border-dark-100 dark:bg-dark-100 py-1 px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary">
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-3 text-sm">
                                        <p class="font-medium">Disjoncteurs différentiels</p>
                                        <p class="text-gray-500 dark:text-gray-400">Ref: DISJ-DIFF-40A-B</p>
                                    </td>
                                    <td class="px-4 py-3 text-center text-sm">5</td>
                                    <td class="px-4 py-3 text-center text-sm">
                                        <input type="number" min="0" max="5" value="5" class="w-16 rounded-lg border border-gray-300 dark:border-dark-100 dark:bg-dark-100 py-1 px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    `;
                    
                    // Si la case "Utiliser l'adresse du client" est cochée, remplir l'adresse
                    if (document.getElementById('use-default-address').checked) {
                        document.getElementById('delivery-address').value = 'Adresse du client #' + this.value;
                        document.getElementById('delivery-city').value = 'Douala';
                        document.getElementById('delivery-country').value = 'Cameroun';
                        document.getElementById('delivery-contact-name').value = 'Contact Client #' + this.value;
                        document.getElementById('delivery-contact-phone').value = '+237 6XX XX XX XX';
                    }
                }, 500);
            } else {
                productsContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-sm italic">Veuillez sélectionner une commande pour afficher les produits.</p>';
            }
        });
    }

    // Boutons de mise à jour du statut de livraison
    document.querySelectorAll('.update-delivery-status-btn').forEach(button => {
        button.addEventListener('click', function() {
            const deliveryId = this.getAttribute('data-id');
            document.getElementById('update-delivery-id').value = deliveryId;
            document.getElementById('update-delivery-ref').value = `#LIV-2023-${deliveryId}`;
            
            // Récupérer le statut actuel
            const statusCell = this.closest('tr').querySelector('td:nth-child(4) span');
            document.getElementById('update-delivery-current-status').value = statusCell.textContent;
            
            // Définir la date du jour
            document.getElementById('update-delivery-date').value = new Date().toISOString().split('T')[0];
            
            toggleModal('update-delivery-status-modal', true);
        });
    });

    // Gestion de l'affichage des bons de livraison et factures
    document.getElementById('generate-delivery-slip-btn').addEventListener('click', function() {
        document.getElementById('invoice-preview').classList.add('hidden');
        document.getElementById('delivery-slip').classList.remove('hidden');
    });

    document.getElementById('generate-invoice-btn').addEventListener('click', function() {
        document.getElementById('delivery-slip').classList.add('hidden');
        document.getElementById('invoice-preview').classList.remove('hidden');
    });

    // Boutons pour afficher les détails des marqueurs sur la carte
    document.querySelectorAll('.delivery-marker').forEach(marker => {
        marker.addEventListener('click', function() {
            const deliveryId = this.getAttribute('data-id');
            // Ouvrir la modale des détails de livraison
            document.getElementById('delivery-details-loader').style.display = 'flex';
            
            setTimeout(() => {
                document.getElementById('delivery-details-ref').textContent = `#LIV-2023-${deliveryId}`;
                document.getElementById('delivery-details-loader').style.display = 'none';
                toggleModal('delivery-details-modal', true);
            }, 300);
        });
    });
}

// Fonction pour ajouter des gestionnaires d'événements aux lignes de produits
function addProductRowEventListeners(row) {
    // Gestionnaire pour la sélection du produit
    const productSelect = row.querySelector('.product-select');
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            const option = this.options[this.selectedIndex];
            const price = option.getAttribute('data-price') || 0;
            const priceCell = row.querySelector('.product-price');
            const quantityInput = row.querySelector('.product-quantity');
            const totalCell = row.querySelector('.product-total');
            
            // Mettre à jour le prix unitaire
            priceCell.textContent = `${new Intl.NumberFormat('fr-FR').format(price)} FCFA`;
            
            // Calculer le total
            const quantity = parseInt(quantityInput.value) || 0;
            const total = quantity * price;
            totalCell.textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA`;
            
            // Mettre à jour le total général
            updateOrderTotal();
        });
    }
    
    // Gestionnaire pour la quantité
    const quantityInput = row.querySelector('.product-quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const productSelect = row.querySelector('.product-select');
            const option = productSelect.options[productSelect.selectedIndex];
            const price = option.getAttribute('data-price') || 0;
            const totalCell = row.querySelector('.product-total');
            
            // Calculer le total
            const quantity = parseInt(this.value) || 0;
            const total = quantity * price;
            totalCell.textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA`;
            
            // Mettre à jour le total général
            updateOrderTotal();
        });
    }
    
    // Gestionnaire pour le bouton de suppression
    const removeButton = row.querySelector('.remove-product');
    if (removeButton) {
        removeButton.addEventListener('click', function() {
            if (document.querySelectorAll('.product-row').length > 1) {
                row.remove();
                updateOrderTotal();
            } else {
                showToast('Vous devez avoir au moins un produit dans la commande', 'warning');
            }
        });
    }
}

// Fonction pour ajouter des gestionnaires d'événements aux lignes de produits de commande fournisseur
function addSupplierProductRowEventListeners(row) {
    // Gestionnaire pour la sélection du produit
    const productSelect = row.querySelector('.supplier-product-select');
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            const option = this.options[this.selectedIndex];
            const price = option.getAttribute('data-price') || 0;
            const priceInput = row.querySelector('.supplier-product-price');
            priceInput.value = price;
            
            // Calculer le total
            const quantity = parseInt(row.querySelector('.supplier-product-quantity').value) || 0;
            const total = quantity * price;
            row.querySelector('.supplier-product-total').textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA`;
            
            // Mettre à jour le total général
            updateSupplierOrderTotal();
        });
    }
    
    // Gestionnaire pour la quantité
    const quantityInput = row.querySelector('.supplier-product-quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const price = parseFloat(row.querySelector('.supplier-product-price').value) || 0;
            const quantity = parseInt(this.value) || 0;
            const total = quantity * price;
            row.querySelector('.supplier-product-total').textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA`;
            
            // Mettre à jour le total général
            updateSupplierOrderTotal();
        });
    }
    
    // Gestionnaire pour le prix unitaire
    const priceInput = row.querySelector('.supplier-product-price');
    if (priceInput) {
        priceInput.addEventListener('change', function() {
            const quantity = parseInt(row.querySelector('.supplier-product-quantity').value) || 0;
            const price = parseFloat(this.value) || 0;
            const total = quantity * price;
            row.querySelector('.supplier-product-total').textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA`;
            
            // Mettre à jour le total général
            updateSupplierOrderTotal();
        });
    }
    
    // Gestionnaire pour le bouton de suppression
    const removeButton = row.querySelector('.remove-supplier-product');
    if (removeButton) {
        removeButton.addEventListener('click', function() {
            if (document.querySelectorAll('.supplier-product-row').length > 1) {
                row.remove();
                updateSupplierOrderTotal();
            } else {
                showToast('Vous devez avoir au moins un produit dans la commande', 'warning');
            }
        });
    }
}

// Mettre à jour le total de la commande
function updateOrderTotal() {
    const totalCells = document.querySelectorAll('.product-total');
    let total = 0;
    
    totalCells.forEach(cell => {
        const value = cell.textContent.replace(/[^\d]/g, '');
        total += parseInt(value) || 0;
    });
    
    document.getElementById('commande-total').textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA`;
}

// Mettre à jour le total de la commande fournisseur
function updateSupplierOrderTotal() {
    const totalCells = document.querySelectorAll('.supplier-product-total');
    let total = 0;
    
    totalCells.forEach(cell => {
        const value = cell.textContent.replace(/[^\d]/g, '');
        total += parseInt(value) || 0;
    });
    
    document.getElementById('supplier-total-price').textContent = `${new Intl.NumberFormat('fr-FR').format(total)} FCFA`;
}

// Initialiser les filtres et la recherche
function initFiltersAndSearch() {
    // Recherche dans les commandes
    const commandeSearch = document.getElementById('commande-search');
    if (commandeSearch) {
        commandeSearch.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.commande-row');
            
            rows.forEach(row => {
                const id = row.getAttribute('data-id').toLowerCase();
                const client = row.getAttribute('data-client').toLowerCase();
                const match = id.includes(searchTerm) || client.includes(searchTerm);
                row.style.display = match ? '' : 'none';
            });
            
            updateDisplayCounts('commandes');
        });
    }
    
    // Filtrer par statut de commande
    const commandeStatusFilter = document.getElementById('commande-status-filter');
    if (commandeStatusFilter) {
        commandeStatusFilter.addEventListener('change', function() {
            const status = this.value.toLowerCase();
            const rows = document.querySelectorAll('.commande-row');
            
            rows.forEach(row => {
                if (!status || row.getAttribute('data-status').toLowerCase() === status) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updateDisplayCounts('commandes');
        });
    }
    
    // Recherche dans les produits
    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            const rows = document.querySelectorAll('.product-row');
            
            cards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                card.style.display = name.includes(searchTerm) ? '' : 'none';
            });
            
            rows.forEach(row => {
                const name = row.getAttribute('data-name').toLowerCase();
                row.style.display = name.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    // Filtrer les produits par catégorie
    const productCategoryFilter = document.getElementById('product-category-filter');
    if (productCategoryFilter) {
        productCategoryFilter.addEventListener('change', function() {
            const category = this.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            const rows = document.querySelectorAll('.product-row');
            
            cards.forEach(card => {
                if (!category || card.getAttribute('data-category').toLowerCase() === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            
            rows.forEach(row => {
                if (!category || row.getAttribute('data-category').toLowerCase() === category) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Filtrer les produits par statut de stock
    const productStatusFilter = document.getElementById('product-status-filter');
    if (productStatusFilter) {
        productStatusFilter.addEventListener('change', function() {
            const status = this.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            const rows = document.querySelectorAll('.product-row');
            
            cards.forEach(card => {
                if (!status || card.getAttribute('data-stock') === status) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            
            rows.forEach(row => {
                if (!status || row.getAttribute('data-stock') === status) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Recherche dans les clients
    const clientSearch = document.getElementById('client-search');
    if (clientSearch) {
        clientSearch.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.client-row');
            
            rows.forEach(row => {
                const name = row.querySelector('td:first-child .font-medium').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(2) p:first-child').textContent.toLowerCase();
                const match = name.includes(searchTerm) || email.includes(searchTerm);
                row.style.display = match ? '' : 'none';
            });
            
            updateDisplayCounts('clients');
        });
    }
    
    // Filtrer les clients par type
    const clientTypeFilter = document.getElementById('client-type-filter');
    if (clientTypeFilter) {
        clientTypeFilter.addEventListener('change', function() {
            const type = this.value.toLowerCase();
            const rows = document.querySelectorAll('.client-row');
            
            rows.forEach(row => {
                if (!type || row.getAttribute('data-type').toLowerCase() === type) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updateDisplayCounts('clients');
        });
    }
    
    // Recherche dans les fournisseurs
    const supplierSearch = document.getElementById('supplier-search');
    if (supplierSearch) {
        supplierSearch.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.supplier-row');
            
            rows.forEach(row => {
                const name = row.querySelector('td:first-child .font-medium').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(2) p:first-child').textContent.toLowerCase();
                const match = name.includes(searchTerm) || email.includes(searchTerm);
                row.style.display = match ? '' : 'none';
            });
        });
    }
    
    // Recherche dans les livraisons
    const deliverySearch = document.getElementById('delivery-search');
    if (deliverySearch) {
        deliverySearch.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.delivery-row');
            
            rows.forEach(row => {
                const id = row.querySelector('td:first-child').textContent.toLowerCase();
                const client = row.querySelector('td:nth-child(2) span').textContent.toLowerCase();
                const match = id.includes(searchTerm) || client.includes(searchTerm);
                row.style.display = match ? '' : 'none';
            });
            
            updateDisplayCounts('deliveries');
        });
    }
    
    // Filtrer les livraisons par statut
    const deliveryStatusFilter = document.getElementById('delivery-status-filter');
    if (deliveryStatusFilter) {
        deliveryStatusFilter.addEventListener('change', function() {
            const status = this.value.toLowerCase();
            const rows = document.querySelectorAll('.delivery-row');
            
            rows.forEach(row => {
                if (!status || row.getAttribute('data-status').toLowerCase() === status.toLowerCase()) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            updateDisplayCounts('deliveries');
        });
    }
    
    // Filtrer les marqueurs sur la carte de livraison
    const deliveryMapFilter = document.getElementById('delivery-map-filter');
    if (deliveryMapFilter) {
        deliveryMapFilter.addEventListener('change', function() {
            const status = this.value.toLowerCase();
            const markers = document.querySelectorAll('.delivery-marker');
            
            markers.forEach(marker => {
                if (!status || marker.getAttribute('data-status').toLowerCase() === status.toLowerCase()) {
                    marker.style.display = '';
                } else {
                    marker.style.display = 'none';
                }
            });
        });
    }
    
    // Pagination
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            // Simuler la pagination
            if (page === 'prev' || page === 'next') {
                // Logique pour la pagination précédente/suivante
            } else {
                // Mettre à jour l'état actif des boutons
                paginationButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-primary', 'text-white');
                    if (btn.getAttribute('data-page') !== 'prev' && btn.getAttribute('data-page') !== 'next') {
                        btn.classList.add('bg-gray-100', 'dark:bg-dark-100', 'text-sm', 'hover:bg-gray-200', 'dark:hover:bg-opacity-80');
                    }
                });
                
                this.classList.add('active', 'bg-primary', 'text-white');
                this.classList.remove('bg-gray-100', 'dark:bg-dark-100', 'hover:bg-gray-200', 'dark:hover:bg-opacity-80');
            }
        });
    });
}

// Mettre à jour les compteurs d'affichage
function updateDisplayCounts(type) {
    const totalElement = document.querySelectorAll(`.${type}-total`);
    if (totalElement.length) {
        const visibleRows = document.querySelectorAll(`.${type}-row:not([style*="display: none"])`).length;
        totalElement.forEach(el => el.textContent = visibleRows);
    }
}

// Initialiser les fonctionnalités d'exportation
function initExportFeatures() {
    document.getElementById('export-data-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const exportType = document.getElementById('export-type').value;
        const format = document.querySelector('input[name="export-format"]:checked').value;
        
        // Simuler l'exportation
        showToast(`Exportation des données en format ${format.toUpperCase()} en cours...`, 'info');
        
        setTimeout(() => {
            showToast(`Exportation des données ${exportType} terminée`, 'success');
            toggleModal('export-data-modal', false);
        }, 1000);
    });
    
    // Événements pour les boutons d'exportation spécifiques
    document.querySelectorAll('.export-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.closest('[data-name]').getAttribute('data-name');
            
            // Simuler l'exportation du produit
            showToast(`Exportation des détails du produit "${productName}" en cours...`, 'info');
            
            setTimeout(() => {
                showToast(`Exportation du produit "${productName}" terminée`, 'success');
            }, 1000);
        });
    });
}

// Fonction d'impression de la facture
function printInvoice() {
    const invoiceContent = document.getElementById('invoice-preview').innerHTML; // Contenu à imprimer
    const printWindow = window.open('', '', 'width=800,height=600');

    printWindow.document.write(`
        <html>
        <head>
            <title>Impression Facture</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                /* Styles supplémentaires pour l'impression */
                h1, h2, h3, h4, h5, h6 {
                    margin: 0; /* Supprimer les marges pour un meilleur ajustement */
                }

                table {
                    width: 100%; /* S'assurer que les tables utilisent toute la largeur */
                    border-collapse: collapse; /* Collapse des bordures */
                }

                th, td {
                    border: 1px solid #ddd; /* Ajouter des bordures pour les cellules */
                    padding: 8px; /* Ajout d'espace dans les cellules */
                }

                th {
                    background-color: #f2f2f2; /* Couleur de fond pour les en-têtes */
                    text-align: left; /* Alignement à gauche */
                }
            </style>
        </head>
        <body>
            ${invoiceContent}
        </body>
        </html>
    `);

    printWindow.document.close(); // Fermer le document pour que le navigateur puisse le charger
    printWindow.focus(); // Mettre le focus sur la nouvelle fenêtre
    printWindow.print(); // Ouvrir la boîte de dialogue d'impression
    printWindow.close(); // Fermer la fenêtre après l'impression
}

// Export PDF avec jsPDF
document.getElementById('download-invoice-btn').addEventListener('click', function() {
    // Utilisation de la bibliothèque jsPDF
    const { jsPDF } = window.jspdf;
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const invoiceContent = document.getElementById('invoice-content');
    
    // Ajouter l'en-tête
    doc.setFontSize(18);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(document.getElementById('invoice-number').textContent, 105, 30, { align: 'center' });
    
    // Simuler l'exportation
    showToast('Exportation de la facture en PDF...', 'info');
    
    setTimeout(() => {
        // Dans une application réelle, nous utiliserions html2canvas ou similaire
        // pour capturer le contenu HTML en image
        doc.save('facture.pdf');
        showToast('Facture exportée en PDF avec succès', 'success');
    }, 1000);
});

// Export Excel avec SheetJS
document.getElementById('export-all-invoices-btn').addEventListener('click', function() {
    // Utilisation de la bibliothèque SheetJS
    showToast('Exportation des factures en Excel...', 'info');
    
    setTimeout(() => {
        const wb = XLSX.utils.book_new();
        
        // Simuler des données
        const data = [
            ['Référence', 'Client', 'Date', 'Commande', 'Montant', 'Statut'],
            ['#FAC-2023-1542', 'Jean Paul Entreprises', '24 Août 2023', '#CMD-2023-1542', '2450000', 'Payée'],
            ['#FAC-2023-1541', 'SONEL Douala', '23 Août 2023', '#CMD-2023-1541', '1870000', 'En attente'],
            ['#FAC-2023-1540', 'Cameroun Motors', '22 Août 2023', '#CMD-2023-1540', '3420000', 'Brouillon']
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Factures');
        
        XLSX.writeFile(wb, 'factures.xlsx');
        showToast('Factures exportées en Excel avec succès', 'success');
    }, 1000);
});

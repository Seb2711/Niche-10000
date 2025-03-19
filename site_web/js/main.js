// Script principal pour Santé Naturelle Plus

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des tooltips Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialisation des popovers Bootstrap
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Animation des éléments au scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('active');
            }
        });
    };

    // Exécuter l'animation au chargement et au scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Gestion du formulaire de newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simuler l'envoi du formulaire
                showNotification('Merci de vous être inscrit à notre newsletter !');
                emailInput.value = '';
            } else {
                showNotification('Veuillez entrer une adresse email valide.', 'error');
            }
        });
    }

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            if (name && validateEmail(email) && message) {
                // Simuler l'envoi du formulaire
                showNotification('Votre message a été envoyé avec succès !');
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
            } else {
                showNotification('Veuillez remplir tous les champs correctement.', 'error');
            }
        });
    }

    // Gestion des boutons d'achat et d'affiliation
    const affiliateButtons = document.querySelectorAll('.btn-affiliate');
    affiliateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Enregistrer le clic pour les statistiques
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            
            // Enregistrer l'événement de conversion
            trackConversion(productId, productName);
            
            // Afficher une notification
            showNotification('Redirection vers le site partenaire...');
        });
    });

    // Popup de capture d'email
    setTimeout(() => {
        const popupOverlay = document.getElementById('popup-newsletter');
        if (popupOverlay && !localStorage.getItem('popup_shown')) {
            popupOverlay.classList.add('active');
            
            // Marquer le popup comme affiché
            localStorage.setItem('popup_shown', 'true');
            
            // Fermeture du popup
            const closeButton = popupOverlay.querySelector('.popup-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    popupOverlay.classList.remove('active');
                });
            }
            
            // Clic en dehors du popup
            popupOverlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        }
    }, 5000); // Afficher après 5 secondes
});

// Fonctions utilitaires

// Validation d'email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Affichage de notifications
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        ${message}
        <span class="notification-close">&times;</span>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Afficher avec animation
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Fermeture de la notification
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Fermeture automatique après 5 secondes
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Suivi des conversions
function trackConversion(productId, productName) {
    // Enregistrer la conversion dans le stockage local pour démonstration
    const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
    conversions.push({
        productId: productId,
        productName: productName,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('conversions', JSON.stringify(conversions));
    
    // Dans un environnement réel, on enverrait ces données à un serveur
    console.log(`Conversion enregistrée pour ${productName} (ID: ${productId})`);
    
    // Simuler l'envoi de données à un service d'analyse
    if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
            'value': 1.0,
            'currency': 'EUR',
            'transaction_id': generateTransactionId()
        });
    }
}

// Génération d'ID de transaction unique
function generateTransactionId() {
    return 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Gestion des filtres de produits
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Tri des produits
function sortProducts(sortBy) {
    const productsContainer = document.querySelector('.products-container');
    if (!productsContainer) return;
    
    const products = Array.from(productsContainer.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        if (sortBy === 'price-asc') {
            return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
        } else if (sortBy === 'price-desc') {
            return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
        } else if (sortBy === 'rating') {
            return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
        } else { // newest
            return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
        }
    });
    
    // Réorganiser les produits dans le DOM
    products.forEach(product => {
        productsContainer.appendChild(product);
    });
}

// Compteur de décompte pour les offres limitées
function startCountdown(elementId, endTime) {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) return;
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            countdownElement.innerHTML = "Offre expirée";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;
    };
    
    // Mettre à jour immédiatement puis toutes les secondes
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialisation des compteurs de décompte
function initCountdowns() {
    const countdowns = document.querySelectorAll('[data-countdown]');
    countdowns.forEach(countdown => {
        const endTime = new Date(countdown.getAttribute('data-countdown')).getTime();
        startCountdown(countdown.id, endTime);
    });
}

// Appeler l'initialisation des compteurs si nécessaire
if (document.querySelector('[data-countdown]')) {
    initCountdowns();
}

// Système de suivi des clics d'affiliation
class AffiliateTracker {
    constructor() {
        this.trackingData = JSON.parse(localStorage.getItem('affiliate_tracking') || '[]');
        this.initTracking();
    }
    
    initTracking() {
        // Suivre tous les liens d'affiliation
        document.querySelectorAll('a[data-affiliate]').forEach(link => {
            link.addEventListener('click', (e) => {
                const productId = link.getAttribute('data-product-id');
                const affiliateId = link.getAttribute('data-affiliate');
                
                this.trackClick(productId, affiliateId);
                
                // Ajouter des paramètres de suivi à l'URL
                const href = new URL(link.href);
                href.searchParams.append('ref', affiliateId);
                href.searchParams.append('src', 'santenaturelleplus');
                link.href = href.toString();
            });
        });
    }
    
    trackClick(productId, affiliateId) {
        this.trackingData.push({
            productId,
            affiliateId,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        });
        
        localStorage.setItem('affiliate_tracking', JSON.stringify(this.trackingData));
        console.log(`Clic d'affiliation enregistré: Produit ${productId}, Affilié ${affiliateId}`);
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = 'SES-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            sessionStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }
    
    getStats() {
        // Statistiques simples pour démonstration
        const stats = {
            totalClicks: this.trackingData.length,
            clicksByProduct: {},
            clicksByAffiliate: {}
        };
        
        this.trackingData.forEach(data => {
            // Comptage par produit
            if (!stats.clicksByProduct[data.productId]) {
                stats.clicksByProduct[data.productId] = 0;
            }
            stats.clicksByProduct[data.productId]++;
            
            // Comptage par affilié
            if (!stats.clicksByAffiliate[data.affiliateId]) {
                stats.clicksByAffiliate[data.affiliateId] = 0;
            }
            stats.clicksByAffiliate[data.affiliateId]++;
        });
        
        return stats;
    }
}

// Initialiser le tracker d'affiliation
const affiliateTracker = new AffiliateTracker();

// Système de recommandation de produits
class ProductRecommender {
    constructor() {
        this.viewedProducts = JSON.parse(localStorage.getItem('viewed_products') || '[]');
        this.initTracking();
    }
    
    initTracking() {
        // Suivre les vues de produits
        if (document.querySelector('.product-detail')) {
            const productId = document.querySelector('.product-detail').getAttribute('data-product-id');
            const productName = document.querySelector('.product-detail h1').textContent;
            const productCategory = document.querySelector('.product-detail').getAttribute('data-category');
            
            this.trackProductView(productId, productName, productCategory);
        }
    }
    
    trackProductView(productId, productName, category) {
        // Éviter les doublons dans la même session
        if (!this.viewedProducts.some(p => p.productId === productId)) {
            this.viewedProducts.push({
                productId,
                productName,
                category,
                timestamp: new Date().toISOString()
            });
            
            // Limiter à 20 produits récents
            if (this.viewedProducts.length > 20) {
                this.viewedProducts.shift();
            }
            
            localStorage.setItem('viewed_products', JSON.stringify(this.viewedProducts));
        }
    }
    
    getRecommendations(currentProductId, count = 4) {
        // Filtrer les produits de la même catégorie
        const currentProduct = this.viewedProducts.find(p => p.productId === currentProductId);
        if (!currentProduct) return [];
        
        const sameCategory = this.viewedProducts.filter(p => 
            p.productId !== currentProductId && p.category === currentProduct.category
        );
        
        // Trier par récence
        sameCategory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Retourner les N premiers
        return sameCategory.slice(0, count);
    }
}

// Initialiser le système de recommandation
const productRecommender = new ProductRecommender();

// Afficher les recommandations si l'élément existe
const recommendationsContainer = document.getElementById('product-recommendations');
if (recommendationsContainer && document.querySelector('.product-detail')) {
    const currentProductId = document.querySelector('.product-detail').getAttribute('data-product-id');
    const recommendations = productRecommender.getRecommendations(currentProductId);
    
    if (recommendations.length > 0) {
        let html = '<h3>Produits recommandés</h3><div class="row">';
        
        recommendations.forEach(product => {
            html += `
                <div class="col-md-3 col-sm-6">
                    <div class="product-card">
                        <a href="produit.html?id=${product.productId}">
                            <h5>${product.productName}</h5>
                        </a>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        recommendationsContainer.innerHTML = html;
    }
}

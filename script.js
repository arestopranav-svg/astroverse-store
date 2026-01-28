// script.js
// Firebase Configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyC0D0X5U6cK7b6qJ2p6w3MxL8nRfT9vW2X",
    authDomain: "astronomy-ecommerce.firebaseapp.com",
    projectId: "astronomy-ecommerce",
    storageBucket: "astronomy-ecommerce.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const loadingScreen = document.querySelector('.loading-screen');
const soundToggle = document.getElementById('soundToggle');
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const closeAuth = document.getElementById('closeAuth');
const footerLoginBtn = document.getElementById('footerLoginBtn');
const userInfo = document.getElementById('userInfo');
const userDisplayName = document.getElementById('userDisplayName');

// Auth Elements
const phoneStep = document.getElementById('phoneStep');
const otpStep = document.getElementById('otpStep');
const loginForm = document.getElementById('loginForm');
const userInfoForm = document.getElementById('userInfoForm');
const countryCode = document.getElementById('countryCode');
const phoneNumber = document.getElementById('phoneNumber');
const sendOTP = document.getElementById('sendOTP');
const phoneDisplay = document.getElementById('phoneDisplay');
const otpInputs = document.querySelectorAll('.otp-input');
const verifyOTP = document.getElementById('verifyOTP');
const resendOTP = document.getElementById('resendOTP');
const otpTimer = document.getElementById('otpTimer');
const countdown = document.getElementById('countdown');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const saveUserInfo = document.getElementById('saveUserInfo');

// Product Elements
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const orderModal = document.getElementById('orderModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const orderDetails = document.getElementById('orderDetails');
const editOrder = document.getElementById('editOrder');
const whatsappOrderLink = document.getElementById('whatsappOrderLink');

// State Variables
let currentProduct = null;
let orderData = null;
let confirmationResult = null;
let otpCountdown = 59;
let countdownInterval = null;
let isAuthenticated = false;
let currentUser = null;

// Products Database
const products = [
    {
        id: 1,
        name: "Galaxy Explorer Telescope",
        category: "telescopes",
        price: 299.99,
        description: "Professional-grade refractor telescope with 90mm aperture, perfect for planetary and deep-sky observation.",
        features: ["90mm aperture", "Includes 2 eyepieces (10mm & 25mm)", "Aluminum tripod", "Smartphone adapter"],
        image: "fas fa-satellite"
    },
    {
        id: 2,
        "name": "Nebula T-Shirt",
        "category": "clothing",
        "price": 24.99,
        "description": "Premium cotton t-shirt with glow-in-the-dark nebula print. Available in multiple sizes.",
        "features": ["100% Cotton", "Glow-in-the-dark print", "Unisex fit", "Machine washable"],
        "image": "fas fa-tshirt",
        "sizes": ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: 3,
        name: "Astrophotography Kit",
        category: "accessories",
        price: 159.99,
        description: "Complete kit for capturing stunning images of planets, stars, and galaxies with your smartphone.",
        features: ["Smartphone adapter", "Wireless shutter remote", "Lens cleaning kit", "Carrying case"],
        image: "fas fa-camera"
    },
    {
        id: 4,
        name: "Solar System Hoodie",
        category: "clothing",
        price: 49.99,
        description: "Warm, comfortable hoodie with detailed solar system design. Perfect for stargazing nights.",
        features: ["80% Cotton, 20% Polyester", "Planet print on back", "Front pocket", "Available in 5 colors"],
        image: "fas fa-hoodie",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 5,
        name: "Professional Reflector Telescope",
        category: "telescopes",
        price: 549.99,
        description: "Advanced 130mm reflector telescope with equatorial mount for serious astronomers.",
        features: ["130mm aperture", "EQ-3 equatorial mount", "Includes 3 eyepieces", "Motor drive ready"],
        image: "fas fa-satellite-dish"
    },
    {
        id: 6,
        name: "Stargazer Binoculars",
        category: "accessories",
        price: 89.99,
        description: "High-powered 10x50 astronomy binoculars with multi-coated lenses for bright, clear views.",
        features: ["10x50 magnification", "Multi-coated optics", "Tripod adaptable", "Water resistant"],
        image: "fas fa-binoculars"
    },
    {
        id: 7,
        name: "Constellation Sweatshirt",
        category: "clothing",
        price: 39.99,
        description: "Soft, comfortable sweatshirt with detailed constellation patterns. Great for casual wear.",
        features: ["Fleece lining", "Zodiac constellations", "Ribbed cuffs and hem", "Unisex sizing"],
        image: "fas fa-star-and-crescent",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
        id: 8,
        name: "Planetary Eyepiece Set",
        category: "accessories",
        price: 129.99,
        description: "Set of 4 premium planetary eyepieces (6mm, 9mm, 15mm, 20mm) for detailed planetary observation.",
        features: ["4 eyepiece set", "Wide field of view", "Multi-coated", "Compatible with most telescopes"],
        image: "fas fa-eye"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Remove loading screen after 1.5 seconds
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 1500);
    
    // Initialize event listeners
    initEventListeners();
    
    // Load products
    renderProducts();
    
    // Check if user is already logged in
    checkAuthState();
    
    // Initialize animations
    initAnimations();
});

// Initialize all event listeners
function initEventListeners() {
    // Auth related
    loginBtn.addEventListener('click', openAuthModal);
    footerLoginBtn.addEventListener('click', openAuthModal);
    closeAuth.addEventListener('click', closeAuthModal);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Send OTP
    sendOTP.addEventListener('click', handleSendOTP);
    
    // Verify OTP
    verifyOTP.addEventListener('click', handleVerifyOTP);
    
    // Resend OTP
    resendOTP.addEventListener('click', handleResendOTP);
    
    // Save user info
    saveUserInfo.addEventListener('click', handleSaveUserInfo);
    
    // OTP input handling
    otpInputs.forEach(input => {
        input.addEventListener('input', handleOtpInput);
        input.addEventListener('keydown', handleOtpKeydown);
    });
    
    // Product modal
    closeModal.addEventListener('click', closeProductModal);
    
    // Order modal
    editOrder.addEventListener('click', closeOrderModal);
    
    // Sound toggle
    soundToggle.addEventListener('click', toggleSound);
    
    // Filter products
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', filterProducts);
    });
    
    // Footer filter links
    document.querySelectorAll('.footer-links a[data-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            filterProducts({ target: document.querySelector(`.filter-btn[data-filter="${filter}"]`) });
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === authModal) closeAuthModal();
        if (e.target === productModal) closeProductModal();
        if (e.target === orderModal) closeOrderModal();
    });
}

// Check Firebase auth state
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            currentUser = user;
            isAuthenticated = true;
            
            // Update UI
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'flex';
            
            // Get user data from localStorage
            const userData = JSON.parse(localStorage.getItem('stellarUser') || '{}');
            userDisplayName.textContent = userData.name || `User ${user.phoneNumber.slice(-4)}`;
            
            // Close auth modal if open
            closeAuthModal();
        } else {
            // User is signed out
            currentUser = null;
            isAuthenticated = false;
            
            // Update UI
            loginBtn.style.display = 'flex';
            logoutBtn.style.display = 'none';
            userDisplayName.textContent = 'Guest';
        }
    });
}

// Open auth modal
function openAuthModal() {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset forms
    phoneStep.classList.add('active');
    otpStep.classList.remove('active');
    loginForm.classList.add('active');
    userInfoForm.classList.remove('active');
    
    // Reset inputs
    phoneNumber.value = '';
    otpInputs.forEach(input => input.value = '');
    userName.value = '';
    userEmail.value = '';
}

// Close auth modal
function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear any existing countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}

// Handle sending OTP
function handleSendOTP() {
    const phone = countryCode.value + phoneNumber.value;
    
    if (!phoneNumber.value || phoneNumber.value.length < 10) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Show loading state
    sendOTP.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendOTP.disabled = true;
    
    // Firebase phone auth with invisible reCAPTCHA
    const appVerifier = new firebase.auth.RecaptchaVerifier('sendOTP', {
        'size': 'invisible',
        'callback': function(response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber
        }
    });
    
    auth.signInWithPhoneNumber(phone, appVerifier)
        .then(result => {
            confirmationResult = result;
            
            // Show OTP step
            phoneStep.classList.remove('active');
            otpStep.classList.add('active');
            phoneDisplay.textContent = phone;
            
            // Start OTP countdown
            startOtpCountdown();
            
            showNotification('OTP sent successfully!', 'success');
        })
        .catch(error => {
            console.error('Error sending OTP:', error);
            showNotification('Failed to send OTP. Please try again.', 'error');
        })
        .finally(() => {
            sendOTP.innerHTML = 'Send OTP <i class="fas fa-paper-plane"></i>';
            sendOTP.disabled = false;
        });
}

// Handle OTP verification
function handleVerifyOTP() {
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    
    if (otp.length !== 6) {
        showNotification('Please enter a valid 6-digit OTP', 'error');
        return;
    }
    
    // Show loading state
    verifyOTP.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyOTP.disabled = true;
    
    confirmationResult.confirm(otp)
        .then(result => {
            // User signed in successfully
            currentUser = result.user;
            isAuthenticated = true;
            
            // Check if user info exists in localStorage
            const userData = JSON.parse(localStorage.getItem('stellarUser') || '{}');
            
            if (userData.name) {
                // User info already exists
                userDisplayName.textContent = userData.name;
                showNotification('Login successful!', 'success');
                closeAuthModal();
            } else {
                // Show user info form
                loginForm.classList.remove('active');
                userInfoForm.classList.add('active');
            }
        })
        .catch(error => {
            console.error('Error verifying OTP:', error);
            showNotification('Invalid OTP. Please try again.', 'error');
        })
        .finally(() => {
            verifyOTP.innerHTML = 'Verify OTP <i class="fas fa-check-circle"></i>';
            verifyOTP.disabled = false;
        });
}

// Handle resend OTP
function handleResendOTP() {
    const phone = countryCode.value + phoneNumber.value;
    
    // Show loading state
    resendOTP.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resending...';
    resendOTP.disabled = true;
    
    const appVerifier = new firebase.auth.RecaptchaVerifier('resendOTP', {
        'size': 'invisible'
    });
    
    auth.signInWithPhoneNumber(phone, appVerifier)
        .then(result => {
            confirmationResult = result;
            
            // Reset countdown
            otpCountdown = 59;
            startOtpCountdown();
            
            showNotification('OTP resent successfully!', 'success');
        })
        .catch(error => {
            console.error('Error resending OTP:', error);
            showNotification('Failed to resend OTP. Please try again.', 'error');
        })
        .finally(() => {
            resendOTP.innerHTML = 'Resend OTP <i class="fas fa-redo"></i>';
            resendOTP.disabled = false;
        });
}

// Handle OTP input
function handleOtpInput(e) {
    const input = e.target;
    const index = parseInt(input.getAttribute('data-index'));
    
    // Move to next input if current is filled
    if (input.value && index < 5) {
        otpInputs[index + 1].focus();
    }
    
    // Auto-submit if all inputs are filled
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    if (otp.length === 6) {
        // Small delay for UX
        setTimeout(() => {
            handleVerifyOTP();
        }, 300);
    }
}

// Handle OTP keydown (for backspace)
function handleOtpKeydown(e) {
    const input = e.target;
    const index = parseInt(input.getAttribute('data-index'));
    
    if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus();
    }
}

// Start OTP countdown timer
function startOtpCountdown() {
    // Clear any existing countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    otpCountdown = 59;
    countdown.textContent = otpCountdown;
    otpTimer.style.display = 'block';
    resendOTP.disabled = true;
    
    countdownInterval = setInterval(() => {
        otpCountdown--;
        countdown.textContent = otpCountdown;
        
        if (otpCountdown <= 0) {
            clearInterval(countdownInterval);
            otpTimer.style.display = 'none';
            resendOTP.disabled = false;
        }
    }, 1000);
}

// Handle saving user info
function handleSaveUserInfo() {
    const name = userName.value.trim();
    const email = userEmail.value.trim();
    
    if (!name) {
        showNotification('Please enter your name', 'error');
        return;
    }
    
    // Save user info to localStorage
    const userData = {
        name: name,
        email: email || '',
        phone: currentUser.phoneNumber,
        userId: currentUser.uid
    };
    
    localStorage.setItem('stellarUser', JSON.stringify(userData));
    
    // Update UI
    userDisplayName.textContent = name;
    showNotification('Profile saved successfully!', 'success');
    
    // Close auth modal
    closeAuthModal();
}

// Handle logout
function handleLogout() {
    auth.signOut().then(() => {
        // Clear user data from localStorage
        localStorage.removeItem('stellarUser');
        
        showNotification('Logged out successfully', 'success');
    }).catch(error => {
        console.error('Error signing out:', error);
        showNotification('Error logging out', 'error');
    });
}

// Render products to the grid
function renderProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card glass-card';
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="order-btn" data-id="${product.id}">Order Now</button>
                    <button class="detail-btn" data-id="${product.id}">Details</button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to product buttons
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', handleOrderClick);
    });
    
    document.querySelectorAll('.detail-btn').forEach(btn => {
        btn.addEventListener('click', handleDetailClick);
    });
}

// Filter products
function filterProducts(e) {
    const filter = e.target.getAttribute('data-filter');
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Render filtered products
    renderProducts(filter);
}

// Handle order button click
function handleOrderClick(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    currentProduct = products.find(p => p.id === productId);
    
    if (!isAuthenticated) {
        showNotification('Please login to place an order', 'warning');
        openAuthModal();
        return;
    }
    
    openProductModal(currentProduct);
}

// Handle detail button click
function handleDetailClick(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    openProductModal(product);
}

// Open product modal
function openProductModal(product) {
    currentProduct = product;
    
    // Build modal content
    let sizesHtml = '';
    if (product.sizes) {
        sizesHtml = `
            <div class="size-selector">
                <h4>Select Size:</h4>
                <div class="size-options">
                    ${product.sizes.map(size => `
                        <button class="size-option" data-size="${size}">${size}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="product-modal-image">
            <div class="product-image-large">
                <i class="${product.image}"></i>
            </div>
        </div>
        <div class="product-modal-details">
            <h2>${product.name}</h2>
            <div class="product-price-large">$${product.price}</div>
            <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
            
            <div class="product-description">
                <h4>Description</h4>
                <p>${product.description}</p>
            </div>
            
            <div class="product-features">
                <h4>Features</h4>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            ${sizesHtml}
            
            <div class="quantity-selector">
                <h4>Quantity:</h4>
                <div class="quantity-control">
                    <button class="quantity-btn" id="decreaseQty">-</button>
                    <input type="number" id="productQty" value="1" min="1" max="10">
                    <button class="quantity-btn" id="increaseQty">+</button>
                </div>
            </div>
            
            <button class="btn btn-primary" id="confirmOrder">
                <i class="fab fa-whatsapp"></i> Order via WhatsApp
            </button>
        </div>
    `;
    
    // Show modal
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add event listeners for modal elements
    document.getElementById('confirmOrder').addEventListener('click', prepareOrder);
    
    // Quantity controls
    document.getElementById('decreaseQty').addEventListener('click', () => {
        const qtyInput = document.getElementById('productQty');
        if (parseInt(qtyInput.value) > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
        }
    });
    
    document.getElementById('increaseQty').addEventListener('click', () => {
        const qtyInput = document.getElementById('productQty');
        if (parseInt(qtyInput.value) < 10) {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        }
    });
    
    // Size selection
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    // Select first size by default
    const firstSize = document.querySelector('.size-option');
    if (firstSize) firstSize.classList.add('selected');
}

// Close product modal
function closeProductModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Prepare order for WhatsApp
function prepareOrder() {
    if (!currentProduct) return;
    
    // Get order details
    const quantity = parseInt(document.getElementById('productQty').value) || 1;
    let size = 'N/A';
    
    const selectedSize = document.querySelector('.size-option.selected');
    if (selectedSize) {
        size = selectedSize.getAttribute('data-size');
    }
    
    // Get user data
    const userData = JSON.parse(localStorage.getItem('stellarUser') || '{}');
    
    // Prepare order data
    orderData = {
        product: currentProduct.name,
        price: currentProduct.price,
        quantity: quantity,
        size: size,
        customerName: userData.name || 'Customer',
        address: '' // Will be filled by user in WhatsApp
    };
    
    // Close product modal
    closeProductModal();
    
    // Show order confirmation modal
    showOrderConfirmation();
}

// Show order confirmation modal
function showOrderConfirmation() {
    // Build order details
    orderDetails.innerHTML = `
        <div class="order-item">
            <h4>Product:</h4>
            <p>${orderData.product}</p>
        </div>
        <div class="order-item">
            <h4>Price:</h4>
            <p>$${orderData.price}</p>
        </div>
        <div class="order-item">
            <h4>Quantity:</h4>
            <p>${orderData.quantity}</p>
        </div>
        <div class="order-item">
            <h4>Size:</h4>
            <p>${orderData.size}</p>
        </div>
        <div class="order-item">
            <h4>Total:</h4>
            <p>$${(orderData.price * orderData.quantity).toFixed(2)}</p>
        </div>
        <div class="order-note">
            <p><i class="fas fa-info-circle"></i> You'll be asked for your delivery address in WhatsApp</p>
        </div>
    `;
    
    // Prepare WhatsApp message
    const message = `Hello, I want to place an order:
Product: ${orderData.product}
Price: $${orderData.price}
Quantity: ${orderData.quantity}
Size: ${orderData.size}
Customer Name: ${orderData.customerName}
Address: __________`;

    const encodedMessage = encodeURIComponent(message);
    whatsappOrderLink.href = `https://wa.me/919957811508?text=${encodedMessage}`;
    
    // Show modal
    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close order modal
function closeOrderModal() {
    orderModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reopen product modal to edit order
    if (currentProduct) {
        setTimeout(() => {
            openProductModal(currentProduct);
        }, 300);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Toggle sound (placeholder for future implementation)
function toggleSound() {
    const icon = soundToggle.querySelector('i');
    if (icon.classList.contains('fa-volume-up')) {
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        showNotification('Sound muted', 'info');
    } else {
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
        showNotification('Sound enabled', 'info');
    }
}

// Initialize animations
function initAnimations() {
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: rgba(10, 14, 23, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(108, 99, 255, 0.3);
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 3000;
            transform: translateX(100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            max-width: 350px;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification.success {
            border-left: 4px solid var(--success-color);
        }
        
        .notification.error {
            border-left: 4px solid var(--error-color);
        }
        
        .notification.warning {
            border-left: 4px solid var(--warning-color);
        }
        
        .notification.info {
            border-left: 4px solid var(--primary-color);
        }
        
        .notification i {
            font-size: 20px;
        }
        
        .notification.success i {
            color: var(--success-color);
        }
        
        .notification.error i {
            color: var(--error-color);
        }
        
        .notification.warning i {
            color: var(--warning-color);
        }
        
        .notification.info i {
            color: var(--primary-color);
        }
        
        .size-options {
            display: flex;
            gap: 10px;
            margin: 10px 0 20px;
        }
        
        .size-option {
            width: 40px;
            height: 40px;
            border: 1px solid var(--glass-border);
            background: transparent;
            color: var(--text-primary);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .size-option:hover {
            border-color: var(--primary-color);
        }
        
        .size-option.selected {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
        }
        
        .quantity-control {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0 20px;
        }
        
        .quantity-btn {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
        }
        
        .quantity-btn:hover {
            border-color: var(--primary-color);
        }
        
        #productQty {
            width: 60px;
            height: 40px;
            text-align: center;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            border-radius: 8px;
            font-size: 16px;
        }
        
        .product-modal-image {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-image-large {
            width: 200px;
            height: 200px;
            border-radius: 20px;
            background: rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 80px;
            color: var(--primary-color);
        }
        
        .product-modal-details h2 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .product-price-large {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .product-description, .product-features {
            margin: 20px 0;
        }
        
        .product-features ul {
            list-style: none;
            padding-left: 0;
        }
        
        .product-features li {
            padding: 5px 0;
            position: relative;
            padding-left: 25px;
        }
        
        .product-features li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--primary-color);
            font-weight: bold;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid var(--glass-border);
        }
        
        .order-item:last-child {
            border-bottom: none;
        }
        
        .order-note {
            margin-top: 20px;
            padding: 15px;
            background: rgba(37, 211, 102, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .order-note i {
            color: #25D366;
        }
        
        /* Parallax effect for hero section */
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 70% 30%, rgba(108, 99, 255, 0.1) 0%, transparent 50%);
            z-index: -1;
        }
        
        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }
    `;
    
    document.head.appendChild(style);
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual, .space-background .star');
        
        parallaxElements.forEach((element, index) => {
            if (element.classList.contains('star')) {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.product-card, .feature-card, .section-header').forEach(el => {
        observer.observe(el);
    });
    
    // Add animation CSS
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .product-card, .feature-card, .section-header {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .product-card.animate-in, .feature-card.animate-in, .section-header.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Stagger animation for product cards */
        .product-card:nth-child(1) { transition-delay: 0.1s; }
        .product-card:nth-child(2) { transition-delay: 0.2s; }
        .product-card:nth-child(3) { transition-delay: 0.3s; }
        .product-card:nth-child(4) { transition-delay: 0.4s; }
        .product-card:nth-child(5) { transition-delay: 0.5s; }
        .product-card:nth-child(6) { transition-delay: 0.6s; }
        .product-card:nth-child(7) { transition-delay: 0.7s; }
        .product-card:nth-child(8) { transition-delay: 0.8s; }
        
        /* Mobile menu toggle */
        @media (max-width: 768px) {
            .nav-links.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(10, 14, 23, 0.95);
                backdrop-filter: blur(15px);
                padding: 20px;
                border-top: 1px solid var(--glass-border);
                z-index: 1000;
            }
            
            .nav-links.active .nav-link {
                padding: 15px 0;
            }
        }
    `;
    
    document.head.appendChild(animationStyle);
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Note: For production, replace the Firebase config with your actual Firebase project configuration

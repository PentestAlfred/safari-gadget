// Sample product data with prices in TSh
let products = [
    {
        id: 1,
        name: "Premium Smartphone X",
        price: 2069977, // Approximately $899.99 converted to TSh
        category: "smartphones",
        image: "https://images.unsplash.com/photo-1611791484670-ce19b801d192?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 2,
        name: "Wireless Headphones",
        price: 298977, // Approximately $129.99 converted to TSh
        category: "audio",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 3,
        name: "Fast Charge Power Bank",
        price: 114977, // Approximately $49.99 converted to TSh
        category: "charging",
        image: "https://images.unsplash.com/photo-1609091839311-d5365f2e0c5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 4,
        name: "Protective Phone Case",
        price: 57477, // Approximately $24.99 converted to TSh
        category: "protection",
        image: "https://images.unsplash.com/photo-1606760227093-3cbfb79dd2ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
];

// Cart functionality
let cart = [];
let cartCount = 0;
const cartIcon = document.getElementById('cart-icon');
const cartCountElement = document.querySelector('.cart-count');
const productGrid = document.getElementById('product-grid');
const checkoutModal = document.getElementById('checkout-modal');
const ticketModal = document.getElementById('ticket-modal');

// Format number with commas for TSh
function formatTSh(amount) {
    return "TSh " + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    if (productGrid) {
        loadProducts();
        updateCartCount();
        setupEventListeners();
    }
});

// Load products to the page
function loadProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price price-tsh">${formatTSh(product.price)}</p>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <i class="far fa-heart"></i>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    // Cart icon click
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            if (cart.length > 0) {
                openCheckoutModal();
            } else {
                alert('Your cart is empty. Add some products first!');
            }
        });
    }

    // Close modals
    if (document.getElementById('close-checkout')) {
        document.getElementById('close-checkout').addEventListener('click', function() {
            checkoutModal.style.display = 'none';
        });
    }

    if (document.getElementById('close-ticket')) {
        document.getElementById('close-ticket').addEventListener('click', function() {
            ticketModal.style.display = 'none';
        });
    }

    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            showPaymentDetails(this.getAttribute('data-method'));
        });
    });

    // Complete payment
    if (document.getElementById('complete-payment')) {
        document.getElementById('complete-payment').addEventListener('click', function() {
            processPayment();
        });
    }

    // Print ticket
    if (document.getElementById('print-ticket')) {
        document.getElementById('print-ticket').addEventListener('click', function() {
            window.print();
        });
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        cartCount++;
        updateCartCount();
        
        // Animation for feedback
        const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
        button.textContent = 'Added!';
        button.style.backgroundColor = '#4a8c55';
        
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 1500);
    }
}

// Update cart count
function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Open checkout modal
function openCheckoutModal() {
    checkoutModal.style.display = 'block';
}

// Show payment details based on selection
function showPaymentDetails(method) {
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.innerHTML = '';
    
    switch(method) {
        case 'mpesa':
        case 'tigo-pesa':
        case 'airtel-money':
        case 'halotel-pesa':
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <label for="phone-number">Phone Number</label>
                    <input type="tel" id="phone-number" class="form-control" placeholder="Enter your ${method} phone number">
                </div>
                <p>You will receive a payment prompt on your phone. Please enter your PIN to complete the transaction.</p>
            `;
            break;
        case 'visa':
        case 'mastercard':
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <label for="card-number">Card Number</label>
                    <input type="text" id="card-number" class="form-control" placeholder="Enter card number">
                </div>
                <div class="form-group">
                    <label for="card-expiry">Expiry Date</label>
                    <input type="text" id="card-expiry" class="form-control" placeholder="MM/YY">
                </div>
                <div class="form-group">
                    <label for="card-cvv">CVV</label>
                    <input type="text" id="card-cvv" class="form-control" placeholder="CVV">
                </div>
            `;
            break;
    }
}

// Process payment
function processPayment() {
    const selectedMethod = document.querySelector('.payment-method.selected');
    if (!selectedMethod) {
        alert('Please select a payment method');
        return;
    }
    
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerEmail = document.getElementById('customer-email').value;
    
    if (!customerName || !customerPhone || !customerEmail) {
        alert('Please fill in all customer details');
        return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
        checkoutModal.style.display = 'none';
        generateTicket(customerName, customerPhone, customerEmail, selectedMethod.getAttribute('data-method'));
    }, 2000);
}

// Generate ticket
function generateTicket(customerName, customerPhone, customerEmail, paymentMethod) {
    // Generate ticket number (format: SG + YYMMDD + sequence)
    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
    const sequence = Math.floor(Math.random() * 999) + 1;
    const ticketNumber = `SG${dateStr}${sequence.toString().padStart(3, '0')}`;
    
    // Calculate total
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    
    // Update ticket details
    document.getElementById('ticket-number').textContent = ticketNumber;
    document.getElementById('ticket-customer').textContent = customerName;
    document.getElementById('ticket-date').textContent = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('ticket-payment').textContent = formatPaymentMethod(paymentMethod);
    document.getElementById('ticket-total').textContent = formatTSh(total);
    
    // Add items to ticket
    const ticketItems = document.getElementById('ticket-items');
    ticketItems.innerHTML = '';
    cart.forEach(product => {
        const item = document.createElement('div');
        item.className = 'ticket-item';
        item.innerHTML = `
            <span>${product.name}</span>
            <span>${formatTSh(product.price)}</span>
        `;
        ticketItems.appendChild(item);
    });
    
    // Generate QR code
    const qrElement = document.getElementById('qrcode');
    qrElement.innerHTML = '';
    const qrcode = new QRCode(qrElement, {
        text: JSON.stringify({
            ticketNumber: ticketNumber,
            customer: customerName,
            date: now.toISOString(),
            total: total,
            items: cart.map(p => p.name)
        }),
        width: 150,
        height: 150
    });
    
    // Show ticket
    ticketModal.style.display = 'block';
    
    // Clear cart
    cart = [];
    cartCount = 0;
    updateCartCount();
}

// Format payment method for display
function formatPaymentMethod(method) {
    const methodMap = {
        'mpesa': 'M-Pesa',
        'tigo-pesa': 'Tigo Pesa',
        'airtel-money': 'Airtel Money',
        'halotel-pesa': 'Halotel Pesa',
        'visa': 'Visa',
        'mastercard': 'Mastercard'
    };
    return methodMap[method] || method;
}
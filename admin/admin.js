// Admin credentials (in a real application, these would be stored securely on the server)
const ADMIN_CREDENTIALS = {
    username: "safariadmin",
    password: "StrongPassword123!@#",
    twoFactor: "123456"
};

// Allowed IP addresses for admin access (in a real application, this would be handled on the server)
const ALLOWED_IPS = ["192.168.1.1", "127.0.0.1"];

// Initialize admin functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    } else {
        showAdminLogin();
    }
    
    setupAdminEventListeners();
});

// Set up admin event listeners
function setupAdminEventListeners() {
    // Admin login
    if (document.getElementById('admin-login-btn')) {
        document.getElementById('admin-login-btn').addEventListener('click', function() {
            adminLoginAction();
        });
    }

    // Add product
    if (document.getElementById('add-product')) {
        document.getElementById('add-product').addEventListener('click', function() {
            addProduct();
        });
    }

    // Logout
    if (document.getElementById('logout-btn')) {
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminLoggedIn');
            showAdminLogin();
        });
    }

    // Delete product
    const adminProductList = document.getElementById('admin-product-list');
    if (adminProductList) {
        adminProductList.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-danger')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                deleteProduct(productId);
            }
        });
    }
}

// Show admin login
function showAdminLogin() {
    const adminLogin = document.getElementById('admin-login');
    const adminPanel = document.getElementById('admin-panel');
    
    if (adminLogin) adminLogin.style.display = 'flex';
    if (adminPanel) adminPanel.style.display = 'none';
}

// Show admin panel
function showAdminPanel() {
    const adminLogin = document.getElementById('admin-login');
    const adminPanel = document.getElementById('admin-panel');
    
    if (adminLogin) adminLogin.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    
    loadAdminProducts();
}

// Load products to admin panel
function loadAdminProducts() {
    const adminProductList = document.getElementById('admin-product-list');
    if (!adminProductList) return;
    
    adminProductList.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${formatTSh(product.price)}</td>
            <td>${product.category}</td>
            <td>
                <button class="btn btn-danger" data-id="${product.id}">Delete</button>
            </td>
        `;
        adminProductList.appendChild(row);
    });
}

// Admin login action
function adminLoginAction() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const twoFactor = document.getElementById('admin-2fa').value;
    const messageElement = document.getElementById('admin-login-message');
    
    // In a real application, this would be done on the server with proper IP validation
    // For demonstration purposes, we're using a simple client-side check
    if (username === ADMIN_CREDENTIALS.username && 
        password === ADMIN_CREDENTIALS.password && 
        twoFactor === ADMIN_CREDENTIALS.twoFactor) {
        
        // Simulate IP check (in a real application, this would be done on the server)
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                if (ALLOWED_IPS.includes(data.ip)) {
                    localStorage.setItem('adminLoggedIn', 'true');
                    showAdminPanel();
                } else {
                    messageElement.textContent = 'Access denied. Your IP is not allowed.';
                    messageElement.style.display = 'block';
                }
            })
            .catch(() => {
                // If IP detection fails, still allow access for demo purposes
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
            });
    } else {
        if (messageElement) {
            messageElement.textContent = 'Invalid username, password, or 2FA code.';
            messageElement.style.display = 'block';
        }
    }
}

// Add product (admin)
function addProduct() {
    const name = document.getElementById('product-name').value;
    const price = parseInt(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    
    if (!name || isNaN(price) || !image) {
        alert('Please fill in all product details');
        return;
    }
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name: name,
        price: price,
        category: category,
        image: image
    };
    
    products.push(newProduct);
    
    // In a real application, you would save to a database here
    // For demo purposes, we'll just update the UI
    loadAdminProducts();
    
    // Clear form
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
}

// Delete product (admin)
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        
        // In a real application, you would delete from a database here
        // For demo purposes, we'll just update the UI
        loadAdminProducts();
    }
}
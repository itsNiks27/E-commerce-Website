let products = [];

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8080/api/products');
        products = await response.json();
        showProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        products = [
            { id: 1, name: 'Product 1', price: 19.99, image: 'https://via.placeholder.com/250x200.png?text=Product+1' },
            { id: 2, name: 'Product 2', price: 29.99, image: 'https://via.placeholder.com/250x200.png?text=Product+2' },
            { id: 3, name: 'Product 3', price: 39.99, image: 'https://via.placeholder.com/250x200.png?text=Product+3' },
            { id: 4, name: 'Product 4', price: 49.99, image: 'https://via.placeholder.com/250x200.png?text=Product+4' },
        ];
        showProducts();
    }
}

let cart = [];
let isLoggedIn = false;

// DOM elements
const mainContent = document.getElementById('main-content');
const cartCount = document.getElementById('cart-count');
const homeLink = document.getElementById('home-link');
const productsLink = document.getElementById('products-link');
const cartLink = document.getElementById('cart-link');
const loginLink = document.getElementById('login-link');

// Event listeners
homeLink.addEventListener('click', showHome);
productsLink.addEventListener('click', showProducts);
cartLink.addEventListener('click', showCart);
loginLink.addEventListener('click', showLogin);

// Functions to render different pages
function showHome() {
    mainContent.innerHTML = '<h2>Welcome to our store!</h2><p>Check out our amazing products.</p>';
}

function showProducts() {
    let productsHTML = '<div class="product-grid">';
    products.forEach(product => {
        productsHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
    productsHTML += '</div>';
    mainContent.innerHTML = productsHTML;
}

function showCart() {
    if (cart.length === 0) {
        mainContent.innerHTML = '<h2>Your cart is empty</h2>';
        return;
    }

    let cartHTML = '<h2>Your Cart</h2>';
    let total = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        total += product.price * item.quantity;
        cartHTML += `
            <div class="cart-item">
                <div>
                    <img src="${product.image}" alt="${product.name}">
                    <span>${product.name} - Quantity: ${item.quantity}</span>
                </div>
                <span>$${(product.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    cartHTML += `<h3>Total: $${total.toFixed(2)}</h3>`;
    cartHTML += '<button onclick="checkout()">Proceed to Checkout</button>';
    mainContent.innerHTML = cartHTML;
}

function showLogin() {
    mainContent.innerHTML = `
        <h2>Login</h2>
        <form onsubmit="login(event)">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="#" onclick="showRegister()">Register</a></p>
    `;
}

function showRegister() {
    mainContent.innerHTML = `
        <h2>Register</h2>
        <form onsubmit="register(event)">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="#" onclick="showLogin()">Login</a></p>
    `;
}

// Cart functions
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Authentication function
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            isLoggedIn = true;
            loginLink.textContent = 'Logout';
            loginLink.removeEventListener('click', showLogin);
            loginLink.addEventListener('click', logout);
            showHome();
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
}

function logout() {
    isLoggedIn = false;
    loginLink.textContent = 'Login';
    loginLink.removeEventListener('click', logout);
    loginLink.addEventListener('click', showLogin);
    showHome();
}

async function register(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('http://localhost:8080/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            alert('Registration successful. Please log in.');
            showLogin();
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
    }
}

// Checkout function
function checkout() {
    if (!isLoggedIn) {
        alert('Please log in to complete your purchase.');
        showLogin();
        return;
    }
    // In a real application, you would integrate with a payment gateway here
    alert('Thank you for your purchase!');
    cart = [];
    updateCartCount();
    showHome();
}

// Initialize the application
window.addEventListener('load', fetchProducts);
showHome();
// JavaScript for Cart Modal

document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.querySelector('.add-to-cart');
    const cartModal = document.getElementById('cart');
    const closeBtn = cartModal.querySelector('.close-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const loginRegisterBtn = document.getElementById('login-register-btn');
    const paymentModal = document.getElementById('payment-modal');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const placeOrderBtn = document.getElementById('place-order-btn');

    let cart = [];
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Update login/register button text
    function updateLoginButtonText() {
        const loginRegisterBtn = document.getElementById('login-register-btn');
        if (isLoggedIn) {
            const userName = localStorage.getItem('userName');
            loginRegisterBtn.textContent = `Logout (${userName})`;
        } else {
            loginRegisterBtn.textContent = 'Login/Register';
        }
    }

    // Call this function when the page loads
    updateLoginButtonText();

    // Open cart modal
    cartButton.addEventListener('click', function() {
        if (isLoggedIn) {
            cartModal.style.display = 'block';
        } else {
            alert('Please login or register to view your cart.');
            window.location.href = 'login-register.html';
        }
    });

    // Close cart modal
    closeBtn.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });

    // Add items to cart
    document.querySelectorAll('.food-menu-item button').forEach(button => {
        button.addEventListener('click', function() {
            if (isLoggedIn) {
                const foodItem = this.closest('.food-menu-item');
                const name = foodItem.querySelector('.food-title').innerText;
                const price = parseFloat(foodItem.querySelector('.food-price').innerText.replace('Price: ₹ ', ''));
                
                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }
                
                updateCart();
            } else {
                alert('Please login or register to add items to your cart.');
                window.location.href = 'login-register.html';
            }
        });
    });

    // Update cart
    function updateCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const totalItems = document.getElementById('total-items');
        const totalAmount = document.getElementById('total-amount');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');

        cartItemsContainer.innerHTML = '';
        let items = 0;
        let amount = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <p>${item.name} - ₹${item.price} x ${item.quantity}</p>
                <button class="remove-item" data-name="${item.name}">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            items += item.quantity;
            amount += item.price * item.quantity;
        });

        totalItems.textContent = items;
        totalAmount.textContent = amount.toFixed(2);
        cartCount.textContent = items;
        cartTotal.textContent = amount.toFixed(2);
    }

    // Remove item from cart
    document.querySelector('.cart-items').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const name = e.target.getAttribute('data-name');
            cart = cart.filter(item => item.name !== name);
            updateCart();
        }
    });

    // Login/Register button
    loginRegisterBtn.addEventListener('click', function() {
        if (isLoggedIn) {
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            isLoggedIn = false;
            cart = [];
            updateCart();
            updateLoginButtonText("username");
            alert('Logged out successfully!');
        } else {
            window.location.href = 'login-register.html';
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            cartModal.style.display = 'none';
            paymentModal.style.display = 'block';
        } else {
            alert('Your cart is empty. Add some items before checking out.');
        }
    });

    // Payment option selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            placeOrderBtn.style.display = 'block';
        });
    });

    // Place order
    placeOrderBtn.addEventListener('click', function() {
        alert('Order placed successfully!');
        cart = [];
        updateCart();
        paymentModal.style.display = 'none';
    });
});
import { cart } from '../Data/cart.js';
import { formatCurrency } from './utils/money.js';

// Function to calculate shipping cost
function calculateShipping(total) {
    // Define your shipping cost logic here
    if (total > 5000) {
        return 10; // Free shipping for orders over $5000
    } else {
        return 0; // Flat rate for shipping under $5000
    }
}

// Function to render the payment summary
export function renderPaymentSummary() {
    const paymentSummaryElement = document.querySelector('.js-payment-summary');
    if (!paymentSummaryElement) {
        console.error('.js-payment-summary element not found in the DOM.');
        return;
    }

    // Fetch products data from JSON
    fetch('./products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            // Initialize summary variables
            let subtotal = 0;

            // Generate HTML for cart items
            const itemsHTML = cart.map(cartItem => {
                const product = products.find(product => product.id === cartItem.productId);
                if (product) {
                    const itemTotal = (product.priceCents * cartItem.quantity) / 100; // Convert cents to dollars
                    subtotal += itemTotal; // Add to subtotal
                    return `
                        <div class="cart-item-summary">
                            <div class="product-name">${product.name}</div>
                            <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
                            <div class="product-total">Item Total: $${formatCurrency(itemTotal * 100)}</div>
                        </div>
                    `;
                }
                return '';
            }).join('');
            

        // Calculate shipping and tax
            const shippingCost = calculateShipping(subtotal);
            const tax = subtotal * 0.10; // Assume a 10% tax rate
            const total = subtotal + shippingCost + tax;


     // Render the payment summary
        paymentSummaryElement.innerHTML = `
            <h2>Order Summary</h2>
            <div class="summary-row">
                <span>Items (${cart.reduce((total, item) => total + item.quantity, 0)}):</span>
                <span>$${formatCurrency(subtotal * 100)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping & handling:</span>
                <span>$${formatCurrency(shippingCost * 100)}</span>
            </div>
            <div class="summary-row">
                <span>Total before tax:</span>
                <span>$${formatCurrency(subtotal * 100)}</span>
            </div>
            <div class="summary-row">
                <span>Estimated tax (8%):</span>
                <span>$${formatCurrency(tax * 80)}</span>
            </div>
            <hr />
            <div class="summary-row total">
                <span>Order total:</span>
                <span>$${formatCurrency(total * 100)}</span>
            </div>
            <div><a href="./orders.html">
            <button class="place-order-btn">Place your order</button>
            </a></div>
        `;

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

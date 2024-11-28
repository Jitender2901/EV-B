import { cart, removeFromCart } from '../Data/cart.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../Data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

document.addEventListener('DOMContentLoaded', () => {
    let cartSummaryHTML = '';

    // Fetch products data from products.json
    fetch('./products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            // Generate cart items and render them
            cart.forEach((cartItem) => {
                const matchingProduct = products.find(product => product.id === cartItem.productId);

                if (matchingProduct) {
                    cartSummaryHTML += generateCartItemHTML(matchingProduct, cartItem);
                } else {
                    console.error(`Product with ID ${cartItem.productId} not found.`);
                }
            });

            const orderSummary = document.querySelector('.js-order-summary');
            if (orderSummary) {
                orderSummary.innerHTML = cartSummaryHTML;

                // Ensure product names are updated after rendering
                updateAllProductNames();
            } else {
                console.error('.js-order-summary element not found in the DOM.');
            }

            setupDeleteListeners();
            cart.forEach(cartItem => updateDeliveryDate(cartItem.productId));
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

// Generate the cart item HTML
function generateCartItemHTML(product, cartItem) {
    return `
    <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date js-delivery-date-${product.id}">
            Delivery date: <span class="delivery-date-text"></span>
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image" src="${product.image}" alt="${product.name}">

            <div class="cart-item-details">
                <div class="product-name" data-product-id="${product.id}">
                    ${product.name}
                </div>
                <div class="product-price">
                    $${formatCurrency(product.priceCents)}
                </div>
                <div class="product-quantity">
                    <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
                    <span class="update-quantity-link link-primary">Update</span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${product.id}">Delete</span>
                </div>
            </div>

            <div class="delivery-options" style="display: flex; flex-wrap: wrap; align-items: center;">
                <div class="delivery-options-title" style="margin-right: 10px;">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(product)}
            </div>
        </div>
    </div>`;
}


// Update all product names with descriptions
function updateAllProductNames() {
    updateProductName("1", `EV-B Spectra<br><br> Harness the power of dual hub motors with 2000W combined output, delivering unmatched torque, smooth acceleration, and an impressive top speed of 85 km/h. Wrapped in a sleek metallic frame, the Spectra features a 72V 20Ah lithium-ion battery offering up to 120 km range on a single charge with fast-charging capability. Equipped with hydraulic disc brakes, adjustable suspension, adaptive LED lights, and 18-inch tubeless tires, it ensures a safe, comfortable ride. Additional highlights include a 7-inch LCD display, app integration, cruise control, keyless ignition, and IP67 water resistance—perfect for urban adventures and beyond.`);

    updateProductName("2", `EV-B Nova <br><br> The Nova redefines eco-friendliness with its sleek design featuring integrated solar charging panels, keeping you powered on every adventure. Fueled by a powerful 2000W motor and a 72V 20Ah battery, it achieves a top speed of 90 km/h and an impressive range of up to 120 km. With advanced hydraulic disc brakes, responsive suspension, and 17-inch all-terrain tires, it ensures stability and control on any terrain. Smart features include a vibrant LCD display, app integration for navigation, adaptive cruise control, and keyless start, making it the perfect blend of sustainability and innovation.`);

    updateProductName("3", `EV-B Comet <br><br> The Comet revolutionizes performance with its sleek, aerodynamic design and featherlight construction, delivering lightning-fast acceleration and remarkable agility. Driven by a cutting-edge 1800W motor and a 60V 20Ah battery, it reaches exhilarating speeds of up to 85 km/h and offers an extensive range of 110 km. Equipped with advanced hydraulic brakes, precision suspension, and dynamic 15-inch wheels, it ensures optimal handling and safety in every ride. High-tech features include a crystal-clear LCD interface, smartphone connectivity for diagnostics, smart cruise control, and convenient keyless ignition, making it the ultimate fusion of speed and technology.`);

    updateProductName("4", `EV-B Eclipse <br><br> The Eclipse redefines speed with its aerodynamic design and ultra-lightweight frame, delivering  rapid acceleration and peak performance. Powered by a high-efficiency 1500W motor and a 60V 18Ah battery, it offers a top speed of 80 km/h and up to 100 km range. Equipped with disc brakes, responsive suspension, LED lighting, and 16-inch tires, it ensures control and safety at every turn. Smart features include an LCD display, app integration, cruise control, and keyless start, making it the ultimate blend of speed and innovation.`);
}

// Update product name function
function updateProductName(productId, newName) {
    const productNameElement = document.querySelector(`[data-product-id="${productId}"]`);

    if (productNameElement) {
        productNameElement.innerHTML = newName;
    } else {
        console.error(`Product with ID ${productId} not found.`);
    }
}

// Generate delivery options HTML
function deliveryOptionsHTML(product) {
    return deliveryOptions.map((option, index) => {
        const deliveryDate = dayjs().add(option.deliveryDays, 'days').format('dddd, MMMM D');
        const priceString = option.priceCents === 0
            ? 'FREE - Shipping'
            : `$${formatCurrency(option.priceCents)} - Shipping`;

        return `
        <label class="delivery-option" style="display: inline-flex; align-items: center; margin-right: 20px;">
            <input type="radio" name="delivery-option-${product.id}" 
                class="delivery-option-input" data-delivery-date="${deliveryDate}" ${index === 0 ? 'checked' : ''}>
            <span>
                <span class="delivery-option-date">${deliveryDate}</span>
                <span class="delivery-option-price">${priceString}</span>
            </span>
        </label>`;
    }).join('');
}

// Setup delete event listeners
function setupDeleteListeners() {
    document.querySelectorAll('.js-delete-link').forEach(link => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            removeFromCart(productId);
            console.log(`Removing product with ID: ${productId}`);

            localStorage.removeItem(`delivery-option-${productId}`);
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            if (container) container.remove();
        });
    });
}

// Update delivery date
function updateDeliveryDate(productId) {
    const inputs = document.querySelectorAll(`input[name="delivery-option-${productId}"]`);
    const deliveryDateText = document.querySelector(`.js-delivery-date-${productId} .delivery-date-text`);

    if (!inputs.length) return;

    const defaultInput = inputs[0];
    deliveryDateText.innerHTML = defaultInput.getAttribute('data-delivery-date');

    const storedDate = localStorage.getItem(`delivery-option-${productId}`);
    if (storedDate) {
        const storedInput = [...inputs].find(input => input.getAttribute('data-delivery-date') === storedDate);
        if (storedInput) {
            storedInput.checked = true;
            deliveryDateText.innerHTML = storedDate;
        }
    }

    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const selectedDate = input.getAttribute('data-delivery-date');
            deliveryDateText.innerHTML = selectedDate; 
            localStorage.setItem(`delivery-option-${productId}`, selectedDate);
        });
    });
}


// Call this function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    renderPaymentSummary(); // Populate the payment summary
});

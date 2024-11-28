import { cart, addToCart } from '../Data/cart.js';
import { formatCurrency } from './utils/money.js';

// Fetch products data from products.json
fetch('./products.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // After fetching, pass the data to render products
    renderProducts(data);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

// Ensure the DOM is fully loaded before executing
document.addEventListener('DOMContentLoaded', () => {
  // This part will be empty now as products will be rendered dynamically via renderProducts
});

// Function to render products
function renderProducts(products) {
  const productsGrid = document.querySelector('.js-products-grid');
  if (!productsGrid) {
    console.error('Products grid element not found.');
    return;
  }

  let productsHTML = '';

  // Generate product cards dynamically
  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
          <div class="product-image-container">
              <img class="product-image" src="${product.image}" alt="${product.name}">
          </div>

          <div class="product-name limit-text-to-2-lines">
              ${product.name}
          </div>

          <div class="product-rating-container">
              <img class="product-rating-stars" 
                   src="./img/Ratings/rating-${product.rating.stars * 10}.png">
              <div class="product-rating-count link-primary">
                  ${product.rating.count}
              </div>
          </div>

          <p id="bought">700+ bought in past month</p>

          <div class="product-price">
              <div class="off">-67%&nbsp;</div>
              $${formatCurrency(product.priceCents)}<br>
              <div class="mrp">M.R.P.: 
                  <div class="text-decoration">$2590</div>
              </div>
              <div class="arrival-details">
                  Get it by <strong>Friday, September 6</strong><br>
                  Free Delivery by EV-B
              </div>
          </div>

          <div class="product-quantity-container">
              <select>
                  <option selected value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
              </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
              <img src="./img/logos/checkmark.png"> Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" 
                  data-product-id="${product.id}">
              Add to Cart
          </button>
      </div>
    `;
  });

  // Inject products into the HTML grid
  productsGrid.innerHTML = productsHTML;

  updateCartQuantity();

  // Attach event listeners to "Add to Cart" buttons
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToCart(productId);
      updateCartQuantity();
    });
  });
}

// Update the cart quantity display
function updateCartQuantity() {
  let cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  } else {
    console.error('Cart quantity element not found.');
  }
}

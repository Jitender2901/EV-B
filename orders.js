// Fetch and render orders dynamically
document.addEventListener('DOMContentLoaded', () => {
    fetch('./orders.json') // Fetch product data
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(products => {
        fetch('./orders.json') // Fetch order data
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch orders');
            }
            return response.json();
          })
          .then(orders => renderOrders(products, orders))
          .catch(error => console.error('Error loading orders:', error));
      })
      .catch(error => console.error('Error loading products:', error));
  });
  
  // Render orders
  function renderOrders(products, orders) {
    const ordersGrid = document.getElementById('orders-grid');
    if (!ordersGrid) {
      console.error('Orders grid not found');
      return;
    }
  
    ordersGrid.innerHTML = orders.map(order => generateOrderHTML(order, products)).join('');
  }
  
  // Generate HTML for an order
  function generateOrderHTML(order, products) {
    const orderItemsHTML = order.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        console.error(`Product with ID ${item.productId} not found.`);
        return '';
      }
      return `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-details">
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-delivery-date">Arriving on: ${order.deliveryDate}</div>
            <div class="product-quantity">Quantity: ${item.quantity}</div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="img/buy-again.png" alt="Buy Again">
              <span>Buy it again</span>
            </button>
          </div>
        </div>`;
    }).join('');
  
    return `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">Order Placed: ${order.orderDate}</div>
            <div class="order-total">Total: $${(order.items.reduce((total, item) => {
              const product = products.find(p => p.id === item.productId);
              return product ? total + product.priceCents * item.quantity : total;
            }, 0) / 100).toFixed(2)}</div>
          </div>
          <div class="order-header-right-section">
            <div class="order-id">Order ID: ${order.orderId}</div>
          </div>
        </div>
        ${orderItemsHTML}
      </div>`;
  }
  
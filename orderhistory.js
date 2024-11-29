document.addEventListener('DOMContentLoaded', () => {
    const orderHistoryContainer = document.getElementById('order-history');

    // Fetch user ID from localStorage
    const userId = localStorage.getItem('userId');
    console.log('User ID:', userId);

    if (!userId) {
        orderHistoryContainer.innerHTML = 'Please log in to view your order history.';
        return;
    }

    // Fetch the order history from the server
    fetch(`http://localhost:3000/order-history/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.length === 0) {
                orderHistoryContainer.innerHTML = 'No orders found.';
                return;
            }

            // Create HTML for the orders
            let ordersHTML = '<h1>Your Order History</h1>';
            data.forEach(order => {
                ordersHTML += `
                    <div class="order">
                        <P>Order ID: ${order.orderId}</p>
                        <p>Order Date: ${new Date(order.orderDate).toLocaleString()}</p>
                        <P>Items:</p>
                        <ul>
                            ${order.items.map(item => `
                                <li>
                                    ${item.item_name} - Quantity: ${item.quantity}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            });

            orderHistoryContainer.innerHTML = ordersHTML;
        })
        .catch((error) => {
            console.error('Error fetching order history:', error);
            orderHistoryContainer.innerHTML = 'Error fetching order history. Please try again later.';
        });
});

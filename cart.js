document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please log in to add items to the cart.');
            return;
        }

        const itemName = button.getAttribute('data-item');
        const price = parseFloat(button.getAttribute('data-price'));

        fetch('http://localhost:3000/add-to-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, itemName, price }),
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
    });
});


const userId = localStorage.getItem('userId');

fetch(`http://localhost:3000/cart?userId=${userId}`)
    .then(response => response.json())
    .then(cartItems => {
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = ''; // Clear previous items
        cartItems.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p>${item.item_name} - $${item.price}</p>
                <button class="remove-item" data-id="${item.cart_id}">Remove</button>
            `;
            cartContainer.appendChild(div);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const cartId = button.getAttribute('data-id');

                fetch('http://localhost:3000/remove-from-cart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cartId }),
                })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        location.reload(); // Refresh the cart
                    })
                    .catch(error => console.error('Error:', error));
            });
        });
    })
    .catch(error => console.error('Error:', error));


    document.getElementById('checkout-button').addEventListener('click', () => {
        const userId = localStorage.getItem('userId');
    
        fetch(`http://localhost:3000/cart?userId=${userId}`)
            .then(response => response.json())
            .then(cartItems => {
                const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
                
                fetch('http://localhost:3000/place-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, cart: cartItems }),
                })
                    .then(response => response.json())
                    .then(data => {
                       // alert(data.message);//
                        localStorage.removeItem('cart');
                        window.location.href = 'payment.html';
                    })
                    .catch(error => console.error('Error:', error));
            });
    });
    
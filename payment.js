document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('payment-form');
    const responseMessage = document.getElementById('response-message');

    if (!responseMessage) {
        console.error('Response message element not found');
        return;
    }

    // Fetch user ID from local storage
    const userId = localStorage.getItem('userId');

    if (!userId) {
        responseMessage.textContent = 'Please login to make a payment';
        responseMessage.style.color = 'red';
        form.style.display = 'none';  // Hide form if user is not logged in
        return;
    }

    // Pre-fill the userId (optional, if you want to show it in the form)
    console.log('User ID:', userId);

    // Debugging - Check if the elements exist
    const amountInput = document.getElementById('amount');
    if (!amountInput) {
        console.error('Amount input element not found');
        return;
    }
    console.log('Amount input element:', amountInput);

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page

        // Get the form values
        const amount = amountInput.value;
        console.log('Amount:', amount);  // Log the amount value

        // Validate input (optional)
        if (!amount) {
            responseMessage.textContent = 'Please enter an amount!';
            responseMessage.style.color = 'red';
            return;
        }

        // Send payment data to the server
        fetch('http://localhost:3000/submit-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, amount }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Payment submission failed');
                }
                return response.json();
            })
            .then((data) => {
                responseMessage.textContent = data.message; // Display success message
                responseMessage.style.color = 'green';

                // Optionally clear the form
                form.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                responseMessage.textContent = 'Error submitting payment. Please try again.';
                responseMessage.style.color = 'red';
            });
    });
});

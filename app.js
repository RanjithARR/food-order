const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'root', // Replace with your MySQL password
    database: 'food_order',
    port: 3307
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Routes

// **1. User Registration**
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send({ message: 'Username already exists!' });
            }
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.send({ message: 'Registration successful!' });
    });
});

// **2. User Login**
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }
        if (results.length > 0) {
            res.send({ message: 'Login successful!', userId: results[0].id });
        } else {
            res.status(400).send({ message: 'Invalid username or password.' });
        }
    });
});

// **3. Place Order**
app.post('/place-order', (req, res) => {
    const { userId, cart } = req.body;
    const items = JSON.stringify(cart);
    const query = 'INSERT INTO orders (user_id, items) VALUES (?, ?)';
    db.query(query, [userId, items], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.send({ message: 'Order placed successfully!', orderId: result.insertId });
    });
});



// **5. Fetch Orders**
app.get('/fetch-orders', (req, res) => {
    const { userId } = req.query;
    const query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.send(results);
    });
});

// Add item to cart
app.post('/add-to-cart', (req, res) => {
    const { userId, itemName, price } = req.body;
    const query = 'INSERT INTO cart (user_id, item_name, price) VALUES (?, ?, ?)';
    db.query(query, [userId, itemName, price], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.send({ message: 'Item added to cart!' });
    });
});

// Fetch cart items
app.get('/cart', (req, res) => {
    const { userId } = req.query;
    const query = 'SELECT * FROM cart WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.send(results);
    });
});

// Delete item from cart
app.delete('/remove-from-cart', (req, res) => {
    const { cartId } = req.body;
    const query = 'DELETE FROM cart WHERE cart_id = ?';
    db.query(query, [cartId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Database error' });
        }
        res.send({ message: 'Item removed from cart!' });
    });
});

//submit payment//
app.post('/submit-payment', (req, res) => {
    const userId = req.body.user_Id || req.body.userId;
    const amount = req.body.amount_paid || req.body.amount;

    // Log the data
    console.log('Parsed userId:', userId);
    console.log('Parsed amount:', amount);

    if (!userId || !amount) {
        return res.status(400).send({ message: 'Missing user ID or payment amount' });
    }

    const query = 'INSERT INTO payment (user_id, amount_paid, payment_date) VALUES (?, ?, NOW())';
    db.query(query, [userId, amount], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send({ message: 'Error storing payment information' });
        }

        res.send({ message: 'Payment successful!', paymentId: result.insertId });
    });
});





// Fetch payment history for a user
app.get('/payment-history', (req, res) => {
    const { userId } = req.query;
    const query = 'SELECT * FROM payment WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error fetching payment history' });
        }
        res.send(results);
    });
});


// Fetch order history for a user
app.get('/order-history/:userId', (req, res) => {
    const userId = req.params.userId;

    // SQL query to fetch order history
    const query = `
        SELECT order_id, items, order_date
        FROM orders
        WHERE user_id = ?
        ORDER BY order_date DESC;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching order history:', err);
            return res.status(500).send({ message: 'Error fetching order history' });
        }

        // Parse the items JSON for each order
        const formattedResults = results.map(order => ({
            orderId: order.order_id,
            items: JSON.parse(order.items), // Parse JSON from the items column
            orderDate: order.order_date,
        }));

        res.json(formattedResults); // Send parsed data to the frontend
    });
});



// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

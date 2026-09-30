const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CONNECT TO MYSQL WORKBENCH
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',             
    password: 'MCA@123*', 
    database: 'craftnest_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Successfully connected to MySQL database.');
});

// CHECKOUT ENDPOINT
app.post('/api/checkout', (req, res) => {
    const cartItems = req.body.cart; 

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
    }

    // Format array data for bulk MySQL insertion
    const query = "INSERT INTO orders (item_name, price) VALUES ?";
    const values = cartItems.map(item => [item.name, item.price]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database saving failed" });
        }
        res.status(200).json({ message: "Order stored in MySQL successfully!" });
    });
});

// START EXPRESS SERVER
app.listen(3000, () => {
    console.log('Backend server is live on http://localhost:3000');
});

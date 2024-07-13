const CustomerController = {
    customer: (req, res) => {

        req.db.query('SELECT * FROM customers', (err, customerDetails) => {
            if (err) throw err;
            
            res.render('customer_details.hbs',
                { customerDetails: customerDetails }
            );
        });

    },

    addCustomer: (req, res) => {

        const { customerName, customerEmail, customerPhone, customerAddress } = req.body;

        const addCustomer = 'INSERT INTO customers (customer_name, customer_email, customer_phone, customer_address) VALUES (?, ?, ?, ?)';

        req.db.query(addCustomer, [customerName, customerEmail, customerPhone, customerAddress], (err, results) => {
            if (err) {
                console.error('Error adding entry:', err);
                return res.status(500).json({ success: false, error: 'Failed to add entry' });
            }

            // Check if the entry was found and updated
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Entry not found' });
            }

            // Send a success response
            res.json({ success: true, message: 'Entry updated successfully' });
        });
    },
};

module.exports = { CustomerController };
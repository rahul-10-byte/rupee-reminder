const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

const SalesController = {
    sales: (req, res) => {
        req.db.promise().query(`
            SELECT transaction_id, cd.customer_name, cd.customer_phone, created_at, total_amount, status 
            FROM rupeereminder_new.sales 
            JOIN customers cd ON cd.customer_id = sales.customer_id;
        `)
        .then(([transactionDetails]) => {
            return req.db.promise().query('SELECT * FROM rupeereminder_new.products;')
                .then(([productDetails]) => {
                    res.render('sales.hbs', { transactionDetails, productDetails });
                });
        })
        .catch(err => {
            console.error('Error fetching sales data:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    },

    getTransactionDetails: (req, res) => {
        const { transactionId } = req.body;
        req.db.promise().query(`
            SELECT s.transaction_id, cd.customer_name, cd.customer_phone, cd.customer_address, s.created_at, s.quantity, s.total_amount, s.status 
            FROM rupeereminder_new.sales AS s
            JOIN customers AS cd ON cd.customer_id = s.customer_id
            WHERE s.transaction_id = ?;
        `, [transactionId])
        .then(([transactionDetails]) => {
            return req.db.promise().query(`
                SELECT p.product_name, p.description, p.price 
                FROM products p
            `).then(([itemDetails]) => {
                res.status(200).json({ transactionDetails, itemDetails });
            });
        })
        .catch(err => {
            console.error('Error fetching transaction details:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    },

    addSalesRecord: (req, res) => {
        const { customer, phone, email, address, product, quantity, price } = req.body;

        console.log(customer, phone, email, address, product, quantity, price);

        let formData = {
            customerName: customer,
            phoneNumber: phone,
            email: email,
            address: address,
            productId: product,
            quantityInput: quantity,
            priceInput: price
        };

        findOrCreateCustomer(req, formData)
            .then(customerId => {
                let totalAmount = calculateTotalAmount(formData);
                return insertTransaction(req, customerId, totalAmount, formData);
            })
            .then(() => {
                res.status(200).json({ message: 'Transaction recorded successfully' });
            })
            .catch(error => {
                console.error('Error:', error);
                res.status(500).json({ error: 'An error occurred while processing the transaction' });
            });
    },

    sendInvoiceEmail: (req, res) => {
        const { to, subject, text, attachment } = req.body;

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'marcellus.kuvalis75@ethereal.email',
                pass: '7hE5W7X9D5MPSnACnu'
            }
        });

        const mailOptions = {
            from: 'Rahul Kalyankar <marcellus.kuvalis75@ethereal.email>',
            to: to,
            subject: subject,
            text: text,
        };

        transporter.sendMail(mailOptions)
            .then(info => {
                console.log('Email sent:', info.response);
                res.status(200).send('Email sent successfully!');
            })
            .catch(error => {
                console.error('Error sending email:', error);
                res.status(500).send('An error occurred while sending the email.');
            });
    },
};

function findOrCreateCustomer(req, formData) {
    return req.db.promise().query('SELECT customer_id FROM customers WHERE customer_email = ?', [formData.email])
        .then(([rows]) => {
            if (rows.length > 0) {
                return rows[0].customer_id; // Return existing customer_id
            } else {
                return req.db.promise().query('INSERT INTO customers (customer_name, customer_email, customer_phone, customer_address) VALUES (?, ?, ?, ?)',
                    [formData.customerName, formData.email, formData.phoneNumber, formData.address])
                    .then(([result]) => result.insertId); // Return newly generated customer_id
            }
        })
        .catch(error => {
            console.error('Error finding/creating customer:', error);
            throw error;
        });
}

function calculateTotalAmount(formData) {
    let totalAmount = parseFloat(formData.priceInput) * parseInt(formData.quantityInput);
    return totalAmount.toFixed(2); // Round to 2 decimal places
}

function insertTransaction(req, customerId, totalAmount, formData) {
    return req.db.promise().query('INSERT INTO sales (customer_id, product_id, quantity, total_amount, status) VALUES (?, ?, ?, ?, ?)',
        [customerId, formData.productId, formData.quantityInput, totalAmount, 'UNPAID'])
        .then(([result]) => result.insertId) // Return newly generated transaction_id
        .catch(error => {
            console.error('Error inserting transaction:', error);
            throw error;
        });
}

module.exports = { SalesController };

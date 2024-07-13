const InventoryController = {
    inventory: (req, res) => {

        req.db.query('SELECT * FROM products', (err, serviceDetails) => {
            if (err) throw err;
            res.render('inventory.hbs', { serviceDetails });

        });
    },
    addProduct: (req, res) => {

        const { productName, description, price } = req.body;

        req.db.query('INSERT INTO products (product_name, description, price) VALUES (?, ?, ?)', [productName, description, price], (err, result) => {
            if (err) {
                console.error('Error adding product:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json({ success: true, message: 'Product added successfully' });
            }
        });
    },

    updateProduct: (req, res) => {
        const { id, ProductName, ProductDescription, ProductPrice } = req.body;

        if (!id) {
            return res.json({ success: false, error: 'Product ID is required' });
        }

        // SQL query to update a product by ID
        const query = 'UPDATE products SET product_name = ?, description = ?, price = ? WHERE product_id = ?';

        req.db.query(query, [ProductName, ProductDescription, ProductPrice, id], (err, result) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.json({ success: false, error: 'Error updating product' });
            }

            if (result.affectedRows > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false, error: 'Product not found' });
            }
        });
    },

    deleteProduct: (req, res) => {
        const productId = req.body.id;

        if (!productId) {
            return res.json({ success: false, error: 'Product ID is required' });
        }

        // SQL query to delete a product by ID
        const query = 'DELETE FROM products WHERE product_id = ?';

        req.db.query(query, [productId], (err, result) => {
            if (err) {
                console.error('Error deleting product:', err);
                return res.json({ success: false, error: 'Error deleting product' });
            }

            if (result.affectedRows > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false, error: 'Product not found' });
            }
        });
    },
};

module.exports = { InventoryController };
const SupplierController = {
    supplier: (req, res) => {

        req.db.query('SELECT * FROM suppliers', (err, supplierDetails) => {
            if (err) throw err;
            
            res.render('supplier_details.hbs',
                { supplierDetails: supplierDetails }
            );
        });

    },
    addSupplier: (req, res) => {

        const { supplierName, supplierEmail, supplierPhone, supplierAddress } = req.body;

        const addsupplier = 'INSERT INTO suppliers (supplier_name, supplier_email, supplier_phone, supplier_address) VALUES (?, ?, ?, ?)';

        req.db.query(addsupplier, [supplierName, supplierEmail, supplierPhone, supplierAddress], (err, results) => {
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

module.exports = { SupplierController };
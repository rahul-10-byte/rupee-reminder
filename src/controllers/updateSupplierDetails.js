const UpdateSupplierDetails = {
    updateDetails: (req, res) => {

        const { id, supplierName, supplierEmail, supplierPhone, supplierAddress } = req.body;

        // Perform the database update
        const updateQuery = 'UPDATE suppliers SET supplier_name = ?, supplier_email = ?, supplier_phone = ?, supplier_address = ? WHERE supplier_id = ?';

        console.log(updateQuery);

        req.db.query(updateQuery, [supplierName, supplierEmail, supplierPhone, supplierAddress, id], (err, results) => {
            if (err) {
                console.error('Error updating entry:', err);
                return res.status(500).json({ success: false, error: 'Failed to update entry' });
            }

            // Check if the entry was found and updated
            if (results.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Entry not found' });
            }

            // Send a success response
            res.json({ success: true, message: 'Entry updated successfully' });
        });

    }
};

module.exports = { UpdateSupplierDetails };
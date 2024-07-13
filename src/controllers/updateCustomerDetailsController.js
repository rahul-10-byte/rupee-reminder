const UpdateCustomerDetailsController = {
    updateDetails: (req, res) => {

        const { id, customerName, customerEmail, customerPhone, customerAddress } = req.body;

        // Perform the database update
        const updateQuery = 'UPDATE customers SET customer_name = ?, customer_email = ?, customer_phone = ?, customer_address = ? WHERE customer_id = ?';

        console.log(updateQuery);

        req.db.query(updateQuery, [customerName, customerEmail, customerPhone, customerAddress, id], (err, results) => {
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

module.exports = { UpdateCustomerDetailsController };

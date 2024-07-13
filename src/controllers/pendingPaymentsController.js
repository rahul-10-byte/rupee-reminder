const PendingPaymentsController = {
    pendingPayments: (req, res) => {

        req.db.query('SELECT * FROM sales where status != "PAID"', (err, results) => {
            if (err) throw err;
            console.log(results);
        res.render('pendingPayments.hbs', {pendingPayments: results});

        });
    },
};

module.exports = { PendingPaymentsController };
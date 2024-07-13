const express = require('express');
const router = express.Router();
const db = require('./config/database');
const mysql = require('mysql2');
const passport = require('passport');

require('dotenv').config();


const { WelcomeController } = require("./controllers/greetingsController");
const { BlankController } = require('./controllers/blankController');
const { HomeController } = require('./controllers/dashboardController');
const { LoginController } = require('./controllers/loginController');
const { CustomerController } = require('./controllers/customerController');
const { SupplierController } = require('./controllers/supplierController');
const { UpdateSupplierDetails } = require('./controllers/updateSupplierDetails');
const { UpdateCustomerDetailsController } = require('./controllers/updateCustomerDetailsController');
const { InventoryController } = require('./controllers/inventoryController');
const { SalesController } = require('./controllers/salesController');
const { PendingPaymentsController } = require('./controllers/pendingPaymentsController');

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		console.log('User is not authenticated. Redirecting to /login.');
		res.redirect('/login');
	}
}


// Login Route
router.get('/login', (req, res) => {
	res.render('login.hbs', { message: req.flash('error') });
});

// Register Route
router.get('/register', (req, res) => {
	res.render('register.hbs');
});

// Passport Authentication for Login
router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

// Logout Route
router.get('/logout', ensureAuthenticated, (req, res) => {
	console.log('Logging out user:', req.user); // Log user information before logout
	req.logout((err) => {
		if (err) {
			console.error('Error during logout:', err);
			return next(err);
		}
		console.log('User logged out'); // Log after logout
		res.redirect('/login');
	});
});

// Home page route
router.get('/', ensureAuthenticated, HomeController.home);

// Welcome page route
router.get("/welcome", WelcomeController.helloWorld);
router.get("/welcome/rahul", WelcomeController.helloRahul);

// Blank page route
router.get('/blank', BlankController.blank);

// Login page route
// router.get('/login', LoginController.login);
// Customer page route
router.get('/customers', ensureAuthenticated, CustomerController.customer);
// Supplier page route
// router.get('/suppliers', SupplierController.supplier);
// Inventory page route
router.get('/inventory', ensureAuthenticated, InventoryController.inventory);
// Sales Page route
router.get('/sales', ensureAuthenticated, SalesController.sales);
// Pending Payments Page route
router.get('/pendingPayments', ensureAuthenticated, PendingPaymentsController.pendingPayments);


// add Customer Details
router.post('/addCustomerDetails', CustomerController.addCustomer);
// add Supplier Details
router.post('/addSupplierDetails', SupplierController.addSupplier);
// Update Supplier Details
router.post('/updateSupplierDetails', UpdateSupplierDetails.updateDetails);
// Update customer details
router.post('/updateCustomerDetails', UpdateCustomerDetailsController.updateDetails);
// Get transaction details
router.post('/getTransactionDetails', SalesController.getTransactionDetails);
// Add sales record
router.post('/addSalesRecord', SalesController.addSalesRecord);
// Add product
router.post('/addProduct', InventoryController.addProduct);
//Update Product
router.post('/updateProduct', InventoryController.updateProduct);
// Delete product
router.post('/deleteProduct', InventoryController.deleteProduct);
// send Invoice Email
router.post('/sendInvoiceEmail', SalesController.sendInvoiceEmail);

module.exports = router;
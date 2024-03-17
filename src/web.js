const express = require('express');
const router = express.Router();

const { WelcomeController } = require("./controllers/greetingsController");
const { BlankController } = require('./controllers/blankController');
const { HomeController } = require('./controllers/dashboardController');
const { LoginController } = require('./controllers/loginController');

// Home page route
router.get('/', HomeController.home);

// Welcome page route
router.get("/welcome", WelcomeController.helloWorld);
router.get("/welcome/rahul", WelcomeController.helloRahul);

// Blank page route
router.get('/blank', BlankController.blank);

// Login page route
router.get('/login', LoginController.login);

module.exports = router;
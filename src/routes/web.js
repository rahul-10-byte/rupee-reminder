const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index.hbs', {
		morris: true
	});
});

router.get('/blank', (req, res) => {
	res.render('blank.hbs', {
		morris: true
	});
});

router.get('/login', (req, res) => {
	res.render('login.hbs', {
		morris: true
	});
});

module.exports = router;
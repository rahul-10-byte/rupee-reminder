const express = require('express');
const path = require('path');
const hbs = require('hbs');
const web = require('./src/web');
const db = require('./src/config/database');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const crypto = require('crypto');
const axios = require('axios');
const secretKey = crypto.randomBytes(64).toString('hex');
const moment = require('moment');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	req.db = db; 	// Attach the MySQL connection to the request object
	next();
});

hbs.registerPartials("./src/views/partials");

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.static(__dirname + "/public/"));
app.use(session({ secret: secretKey, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // Add this line for flash messages
app.use('/', web);

// Register the "eq" helper
hbs.registerHelper('eq', function (a, b) {
    return a === b;
});

// Register the "if_eq" helper
hbs.registerHelper('if_eq', function (a, b, opts) {
    return a === b ? opts.fn(this) : opts.inverse(this);
});

// Passport local strategy
passport.use(new LocalStrategy(
    (username, password, done) => {
        // Replace this query with your actual authentication logic
        db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return done(null, results[0]);
            } else {
                return done(null, false, { message: 'Incorrect username or password' });
            }
        });
    }
));


// Passport session setup
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) throw err;

        done(null, results[0]);
    });
});




app.listen(1000, () => {
	console.log('serving on port 1000');
});
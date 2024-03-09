const express = require('express');
const path = require('path');
const hbs = require('hbs');
const web = require('./src/routes/web');
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

const app = express();

hbs.registerPartials("./src/views/partials");

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.static("./public"));
app.use('/', web);




app.listen(1000, () => {
	console.log('serving on port 1000');
});
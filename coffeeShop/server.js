if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');

const mysql = require('./dbcon.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //lib for encryption password
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const menuRouter = require('./menu.js');
const ordersRouter = require('./order.js');
const confirmationRouter = require('./confirmation.js');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});     //main.handlebars
app.engine('handlebars', handlebars.engine);    // don't need to add handlebars in the end
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.use(express.static('pubilc'));
app.use(express.urlencoded({extended: false}));     //body parser
app.use(flash());
app.use(session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const initializePassport = require('./authentication/passport-config-customer')
initializePassport(
    passport
);

app.post('/account/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/account/login',
    failureFlash: true,         //shows if the  Authenticated is failure
}));

app.use('/account', require('./authentication/account.js'));

app.use('/menu/Menu', menuRouter);

app.use('/order/Order', checkAuthenticated, ordersRouter);

app.use('/order/Confirmation', checkAuthenticated, confirmationRouter);


// checkAuthenticated for the page
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/account/login')
}


app.get('/', (req, res) => {
    var context = {};
    context.loggedin = req.isAuthenticated() ? true : false;
    context.name = req.isAuthenticated() ? req.user.name : ""
    context.message = "main page"
    res.render('index', context)
});


app.use(function (req, res) {
    res.status(404);
    var context = {};
    context.loggedin = req.isAuthenticated() ? true : false;
    res.render('404', context);
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    var context = {};
    context.loggedin = req.isAuthenticated() ? true : false;
    res.render('500');
});

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

const port = process.env.PORT | 8080;
console.log(`Listening to port ${port}`)
app.listen(port);
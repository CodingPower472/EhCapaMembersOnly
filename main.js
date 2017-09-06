var express = require('express');
var app = express();
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var path = require('path');
var cookieParser = require('cookie-parser');
require('./generate-user');

app.use(cookieParser());
app.use(bodyParser.json());

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/db";

app.post('/api/login', function(req, res) {
    console.log('Got request to login');
    var username = req.body.username;
    console.log('Username: ' + username);
    var password = req.body.password;
    console.log('Password: ' + password);
    var isLoggedIn = false;
    MongoClient.connect(url, function(err, db) {
        var users = db.collection('users');
        console.log('database connected');
        var user = users.findOne({
            username: username
        })
            .then(function(user) {
                // Get salt
                var salt = user.salt;
                // Hash password
                // Concatenate salt to password
                bcrypt.hash(password, salt, function(err, hash) {
                    // If result is equal to hashed password
                        // Authenticate user
                    // Else
                        // Send back to login page
                    if (user.passwordHash == hash) {
                        isLoggedIn = true;
                        console.log('passwords match');
                        res.clearCookie('isLoggedIn');
                        res.cookie('isLoggedIn', 'yes', {
                            httpOnly: true
                        });
                        console.log('new cookies', req.cookies.isLoggedIn);
                        res.send({
                            isLoggedIn: true,
                            error: null
                        });
                        console.log('authenticated user');
                    } else {
                        res.clearCookie('isLoggedIn', {
                            httpOnly: true,
                            secure: true
                        });
                        res.send({
                            isLoggedIn: false,
                            error: 'password'
                        });
                        console.log('passwords don\'t match');
                    }
                });
            })
            .catch(function(err) {
                if (err) {
                    console.log(err);
                    console.log('username not found');
                    isLoggedIn = false;
                }
            });
    });
});

app.get('/', function(req, res) {
    console.log('got request to root');
    /*
    console.log('serving thing');
    res.redirect('/err/none');
    */
    // If has logged in cookie
    console.log(req.cookies);
    if (req.cookies.isLoggedIn) {
        // Display members page
        res.sendFile(path.join(__dirname, 'static/members.html'));
        console.log('serving members page');
    } else {
    // Else
        // Display login page
        res.sendFile(path.join(__dirname, 'static/login.html'))
        console.log('serving login page');
     }
});

app.get('/calendar', function(req, res) {
    if (req.cookies.isLoggedIn) {
        res.sendFile(path.join(__dirname, 'static/calendar.html'));
        console.log('serving calendar');
    } else {
        res.sendFile(path.join(__dirname, 'static/login.html'));
    }
})

app.get('/login.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'static/js/login.js'));
});

app.listen(3000);

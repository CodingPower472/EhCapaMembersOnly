var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongo = require('mongodb');
var bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/db";

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'static/signup.html'));
});

app.get('/signup.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'static/js/signup.js'));
});

app.post('/api', function(req, res) {
    console.log('api called');
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.emailAddress;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            var entry = {
                name: name,
                username: username,
                passwordHash: hash,
                salt: salt,
                emailAddress: email,
                isApproved: false
            };
            console.log(entry);
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var users = db.collection('users');
                users.insertOne(entry)
                    .then(function(data) {
                        res.send(true);
                    })
                    .catch(function(err) {
                        console.log('oops!  ' + err);
                        res.send(false);
                    });
            });
        });
    });
});

app.listen(4000);

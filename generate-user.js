var mongo = require('mongodb');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/db";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var password = 'securepswd';
    db.dropDatabase();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) throw err;
        bcrypt.hash(password, salt, function(err, hash) {
            var newUser = {
                username: 'codingpower472',
                passwordHash: hash,
                salt: salt
            };
            db.collection('users').insertOne(newUser, function(err, res) {
                if (err) throw err;
                console.log('user inserted');
                db.close();
            });
        });
    });
});
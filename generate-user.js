var mongo = require('mongodb');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var readline = require('readline');

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/db";

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('What is the username of the user you would like to add? ', function(answer) {
    var username = answer;
    rl.question('What is the password of this user? ', function(answer2) {
        var password = answer2;
        createUser(username, password);
    });
});

function createUser(username, password) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.dropDatabase();
        bcrypt.genSalt(10, function(err, salt) {
            if (err) throw err;
            bcrypt.hash(password, salt, function(err, hash) {
                var newUser = {
                    username: username,
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

}
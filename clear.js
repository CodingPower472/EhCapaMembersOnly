var mongo = require('mongodb');

var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/db";

MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
    users.deleteMany({});
    db.close();
});

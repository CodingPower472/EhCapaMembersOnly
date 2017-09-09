var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var path = require('path');

app.use(bodyParser.json());

var MongoClient = mongo.MongoClient;
var ObjectId = mongo.ObjectId;
var url = "mongodb://localhost:27017/db";

function approveUser(id, errCb) {
    console.log('approving user with id ' + id);
    MongoClient.connect(url, function(err, db) {
        var users = db.collection('users');
        users.findOneAndUpdate({
            '_id': ObjectId(id)
        }, {
            $set: {
                isApproved: true
            }
        })
            .catch(errCb);
    });
}

app.put('/api/:id', function(req, res) {
    console.log('approving user');
    var id = req.params.id;
    var hasErr = false;
    var secretPswd = req.body.secretPswd;
    if (secretPswd == 'ehcapaisawesome') {
        // Approve user
        approveUser(id, function(err) {
            console.log('error: ' + err);
            hasErr = true;
            res.send(false);
        });
    } else {
        hasErr = true;
        res.send(false);
    }
    if (!hasErr) {
        res.send(true);
    }
});

app.get('/api', function(req, res) {
    if (req.query['secretPswd'] == 'ehcapaisawesome') {
        MongoClient.connect(url, function(err, db) {
            var users = db.collection('users');
            var cursor = users.find({
                isApproved: false
            });
            var arr = [];
            cursor.forEach(function(user) {
                arr.push(user);
            }, function() {
                res.send(arr);
                db.close();
            });
            console.log(arr);
        });
    }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'static/administrator.html'));
});

app.get('/administrator.js', function(req,res) {
    res.sendFile(path.join(__dirname, 'static/js/administrator.js'));
});

app.listen(8000);

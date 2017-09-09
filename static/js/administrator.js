var secret_pswd = 'ehcapaisawesome';

function approve_user(userId) {
    // Send request to server authorizing the user id
    $.ajax({
        'url': '/api/' + userId,
        'type': 'PUT',
        'contentType': 'application/json',
        'data': JSON.stringify({
            secretPswd: secret_pswd
        })
    })
        .then(function(data) {
            console.log(data);
            if (data == true) {
                console.log('user with id ' + userId + ' successfully authorized');
                $('#uid' + userId).remove();
                if ($('#requested_users').children().length == 0) {
                    console.log('displaying message');
                    var tableBody = $('.container');
                    $('#t').hide();
                    tableBody.append('<h4>You have no new authentication requests!</h3>');
                }
            }
        })
        .catch(function(err) {
            console.log('something went wrong while authenticating user with id ' + userId);
        });
}

function list_users(callback) {
    console.log('listing users');
    $.ajax({
        'url': '/api/',
        'type': 'GET',
        'dataType': 'application/json',
        'data': {
            secretPswd: secret_pswd
        }
    })
        .always(callback)
        .catch(function(data) {
            callback(JSON.parse(data.responseText));
        });
}

function display_users(data) {
    console.log('displaying users');
    if (data.length == 0) {
        var tableBody = $('.container');
        $('#t').hide();
        tableBody.append('<h4>You have no new authentication requests!</h3>');
    }
    for (var i = 0; i < data.length; i++) {
        var user = data[i];
        var str = '';
        var tableBody = $('#requested_users');
        str += '<tr style="padding: 0 15px 0 15px;" id="uid' + user._id + '">';
        str += '<th>' + user.name + '</th>';
        str += '<th>' + user.username + '</th>';
        str += '<th>' + user.emailAddress + '</th>';
        str += '<th><button class="btn btn-success approve" id="a' + user._id + '">Approve</button></th>';
        str += '<th><button class="btn btn-danger decline" id="d' + user._id + '">Decline</button></th>';
        tableBody.append(str);
    }
    $('.approve').click(onApprove);
    $('.decline').click(onDecline);
}

console.log('administrator.js loaded');
list_users(display_users);

function onApprove(e) {
    var id = e.target.id.substring(1);
    console.log('on approve');
    approve_user(id);
}

function onDecline(e) {
    var id = e.target.id.substring(1);
    $('#uid' + id).remove();
}

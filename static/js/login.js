console.log('login.js running');

console.log(document.cookie);

function sendInfo() {
    console.log('authenticating...');
    var username = $('#username').val();
    var password = $('#password').val();
    console.log(username);
    console.log(password);
    $.ajax({
        'url': '/api/login',
        'type': 'POST',
        'contentType': 'application/json',
        'data': JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(function(data) {
            console.log(data);
            if (data.isLoggedIn) {
                console.log('logged in');
                location.href = '/';
            } else {
                console.log('not logged in');
                $('#username').val('');
                $('#password').val('');
                $('#username').focus();
                if (data.error == 'password') {
                    $('#error').text('Incorrect username or password');
                } else {
                    $('#error').text('Incorrect username');
                }
            }
        })
        .catch(function(err) {
            console.log(err);
        });
}

$('#authenticate').click(sendInfo);
$(document).keydown(function(e) {
    if (e.keyCode == 13) {
        sendInfo();
    }
});

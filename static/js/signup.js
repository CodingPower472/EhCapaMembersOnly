$('#afterauth').hide();
$('#signupbtn').click(signup);

if (localStorage.getItem('hasSignedUp') == 'yes') {
    $('.l').hide();
    $('#afterauth').show();
}

function signup() {
    var name = $('#name').val();
    var username = $('#username').val();
    var email = $('#email').val();
    var password = $('#password').val();
    $.ajax({
        'url': '/api',
        'type': 'POST',
        'contentType': 'application/json',
        'dataType': 'json',
        'data': JSON.stringify({
            'name': name,
            'username': username,
            'emailAddress': email,
            'password': password
        })
    })
        .always(function(data) {
            $('.l').hide();
            $('#afterauth').show();
            localStorage.setItem('hasSignedUp', 'yes');
        });
}

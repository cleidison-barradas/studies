// Declare jQuery and Bootstrap window variables
window.$ = require('jquery');
window.Popper = require('popper.js');
window.Bootstrap = require('bootstrap');

var API_LOGIN = '';
var API_VALIDATE = ''; // DEPRECATED
var API_RENEW = '';
var API_USER_ID = '';
var API_TOKEN = '';

// Backend process
const ipc = require('electron').ipcRenderer;

/**
 * Initialization
 */
ipc.send('render-ready');

ipc.on('app-ready', function(ev, data) {
    const { user_id, token, apiLoginUrl, apiValidateSession, apiRenewSession } = data;
 
    // Setup variables
    API_LOGIN = apiLoginUrl;
    API_VALIDATE = apiValidateSession; // DEPRECATED
    API_RENEW = apiRenewSession;
    API_USER_ID = user_id;
    API_TOKEN = token;

    if (API_TOKEN.length > 0) {
        $.ajax({
            url: API_RENEW,
            method: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('x-user-id', API_USER_ID);
                xhr.setRequestHeader('x-token', API_TOKEN);
            },
            success: function(response) {
                const { status, data } = response;

                if (status === 'error') {
                    $('#content').show();
                    $('#checking').hide();
                } else {
                    const { user_id, publicKey } = data;

                    $('#checking strong').css('color', 'green');
                    $('#checking strong').text('Sessão atual está válida!');

                    ipc.send('renew-keys', {
                        user_id,
                        publicKey
                    });
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                ipc.send('append-log', thrownError);

                $('#content').show();
                $('#checking').hide();
            }
        });
    } else {
        $('#content').show();
        $('#checking').hide();
    }
})

/**
 * Autentication
 */
ipc.on('login-error', function(ev, err) {
    alert(err);
    $('#content').html(`
        <strong style="color: red">Não foi possível armazenar informações de login!</strong>
    `);
});

$('#login-btn').click(function() {
    var username = $('#input-username').val();
    var password = $('#input-password').val();

    if (username.trim().length > 0 && password.trim().length > 0) {
        $('#login-btn').text('LOGANDO...');
        $('#login-btn').prop('disabled', true);

        $.ajax({
            url: API_LOGIN,
            method: 'POST',
            data: {username, password},
            success: function(response) {
                const { status, code, data } = response;
                console.log(response)
                $('#login-btn').text('LOGAR');
                $('#login-btn').prop('disabled', false);

                if (status === 'error') {
                    $('#input-username').addClass('is-invalid');
                    $('#input-password').addClass('is-invalid');
                    $('#input-password').val('');

                    if (code === 'username_password_invalid') {
                        $('.invalid-feedback').show();
                        $('.invalid-feedback').text('Usuário/senha inválido!');
                    }
                } else {
                    $('#content').html(`
                        <strong>Autenticação realizada com sucesso!</strong>
                    `);

                    ipc.send('logged', {
                        token: data.token,
                        publicKey: data.publicKey,
                        user_id: data.user_id,
                        erp_name: data.erp_name
                    });
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                ipc.send('append-log', thrownError);

                $('#login-btn').text('LOGAR');
                $('#login-btn').prop('disabled', false);
            }
        });
    }
});
// Declare jQuery and Bootstrap window variables
window.$ = require('jquery');
window.Popper = require('popper.js');
window.Bootstrap = require('bootstrap');

// ERPs databases
const erps = [
    {
        name: 'SoftPharma',
        value: 'ftp'
    },
    {
        name: 'Linx Big',
        value: 'mysql4'
    },
    {
        name: 'VSM',
        value: 'mysql'
    },
    {
        name: 'Triar',
        value: 'postgres'
    },
    {
        name: 'FarPDV',
        value: 'firebird'
    },
    {
        name: 'SysFarma',
        value: 'firebird'
    },
    {
        name: 'SysFarma DBF',
        value: 'dbf'
    },
    {
        name: 'InovaFarma',
        value: 'mssql'
    },
    {
        name: 'Alpha7 Firebird',
        value: 'firebird'
    },
    {
        name: 'Alpha7 Postgres',
        value: 'postgres'
    },
    {
        name: 'CCP',
        value: 'txt'
    },
    {
        name: 'Inditec',
        value: 'firebird'
    },
    {
        name: 'Platin',
        value: 'txt'
    },
    {
        name: 'Sevenshop',
        value: 'txt'
    },
    {
        name: 'Sisefarma',
        value: 'mssql'
    },
    {
        name: 'Softise',
        value: 'mssql'
    },
    {
        name: 'Sysfar',
        value: 'mysql'
    },
    {
        name: 'Hotline',
        value: 'firebird'
    },
    {
        name: 'HOS',
        value: 'firebird'
    },
    {
        name: 'HOS DBF',
        value: 'dbf'
    },
    {
        name: 'SoftClass',
        value: 'dbf'
    },
    {
        name: 'Farmax',
        value: 'firebird'
    },
    {
        name: 'Automatiza',
        value: 'mysql'
    },
    {
        name: 'Prosystem',
        value: 'mysql'
    },
    {
        name: 'Sortee',
        value: 'mysql'
    },
    {
        name: 'Unifar',
        value: 'firebird'
    },
    {
        name: 'C-Plus',
        value: 'firebird'
    },
    {
        name: 'Infomaster',
        value: 'firebird'
    },
    {
        name: 'Microfarma',
        value: 'dbf'
    },
    {
        name: 'Rey Farma DBF',
        value: 'dbf'
    },
    {
        name: 'Gestcom',
        value: 'oracledb'
    },
    {
        name: 'DigiFarma',
        value: 'firebird'
    },
    {
        name: 'New System',
        value: 'firebird'
    },
    {
        name: 'Infarma Sistemas',
        value: 'mssql'
    },
    {
        name: 'UltraMax',
        value: 'mysql-insecure'
    }
];

// Dialog selector
const { dialog } = require('electron').remote;

// Backend process
const ipc = require('electron').ipcRenderer;

// Load erps dialects
erps.forEach(erp => {
    $('#input-dialect').append(`<option value="${erp.value}">${erp.name}</option>`);
})

/**
 * Initialization
 */
ipc.on('app-ready', function (ev, data) {
    const { database_dialect, database_hostname, database_port, database_name, database_username, database_password, database_convenio, erp_name } = data;

    if (database_dialect) {
        $('#input-dialect').val(database_dialect);
    } else {
        if (erp_name) {
            const erp = erps.find(p => p.name === erp_name);
            if (erp !== undefined) {
                $('#input-dialect').val(erp.value);
            }
        }
    }

    $('#input-hostname').val(database_hostname);
    $('#input-port').val(database_port);
    $('#input-name').val(database_name);
    $('#input-username').val(database_username);
    $('#input-password').val(database_password);
    $('#input-convenio').val(database_convenio);
});

/**
 * Dialect selection
 */
$('#input-dialect').change(function () {
    const fileSelection = `
        <div class="input-group mb-3" id="input-name-container">
            <input type="text" class="form-control required-field" id="input-name">
            <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" id="select-file">Escolher</button>
            </div>
        </div>
    `;


    if ($(this).val() === "ftp") {
        $('#input-hostname').parent().show();
        $('#input-port').parent().hide();
        $('#input-name').parent().hide();
        $('#input-name-container').parent().hide();
        $('#input-username').parent().show();
        $('#input-password').parent().show();
        $('#input-convenio').parent().hide();
    } else if ($(this).val() === "txt" || $(this).val() === "dbf") {
        $('#input-name').parent().show();
        $('#input-name-container').parent().show();
        $('#input-hostname').parent().hide();
        $('#input-port').parent().hide();
        $('#input-username').parent().hide();
        $('#input-password').parent().hide();
        $('#input-convenio').parent().hide();
    } else {
        $('#input-name').parent().show();
        $('#input-name-container').parent().show();
        $('#input-hostname').parent().show();
        $('#input-port').parent().show();
        $('#input-username').parent().show();
        $('#input-password').parent().show();
        $('#input-convenio').parent().show();
    }


    if ($(this).val() === "firebird" || $(this).val() === "txt" || $(this).val() === "dbf") {
        $('#input-name-container').replaceWith(fileSelection);

        /**
         * Setup database
         */
        $('#select-file').unbind();
        $('#select-file').click(function () {
            if ($('#input-dialect').val() === "firebird" || $('#input-dialect').val() === "txt" || $('#input-dialect').val() === "dbf") {
                $('#input-name').val(dialog.showOpenDialogSync({
                    properties: ['openFile']
                }));
            }
        });


    } else {
        $('#input-name-container').replaceWith(`<div id="input-name-container"><input type="text" class="form-control" id="input-name"></div>`);
    }
});

/**
 * Save configs
 */
$('#next-btn').click(function () {
    var emptyFields = $('.required-field:visible').filter(function () {
        return $(this).val() === "";
    });

    if ($('#input-dialect').val() === "none" || $('#input-dialect').val().length === 0) {
        $('#error-alert').text('Você precisa escolher um tipo de banco de dados!');
        $('#error-alert').show();
    }
    else if (emptyFields.length > 0) {
        $('#error-alert').text('Por favor, preencha todos os campos.');
        $('#error-alert').show();
    } else {
        $('#error-alert').hide();
        $('#database-config').hide();
        $('#scheduler-config').fadeIn();
    }
});

/**
 * Save configs
 */
$('#save-btn').click(function () {
    $(this).button('loading');

    const notification = $('input[name=input-notification]:checked').val();

    if ($('#input-interval').val().length > 0) {
        ipc.send('save-config', {
            database_dialect: $('#input-dialect').val(),
            database_hostname: $('#input-hostname').val(),
            database_name: $('#input-name').val(),
            database_port: $('#input-port').val(),
            database_username: $('#input-username').val(),
            database_password: $('#input-password').val(),
            database_convenio: $('#input-convenio').val(),
            sync_interval: $('#input-interval').val(),
            update_channel: $('#input-update-channel').val(),
            notification_enabled: notification
        });
    } else {
        $('#error-alert').text('Define um intervalo para ocorrer a sincronização de produtos');
        $('#error-alert').show();
    }
});
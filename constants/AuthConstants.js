'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('AUTH', [
        'START_PASSWORD_RECOVERY_SUCCESS',
        'START_PASSWORD_RECOVERY_FAILURE',

        'RESET_PASSWORD',
        'RESET_PASSWORD_SUCCESS',
        'RESET_PASSWORD_FAILURE'
    ])
};

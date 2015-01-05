'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('AUTH', [
        'LOGIN',
        'LOGIN_SUCCESS',
        'LOGIN_FAILURE',

        'SIGNUP',
        'SIGNUP_SUCCESS',
        'SIGNUP_FAILURE',

        'LOGOUT',
        'LOGOUT_SUCCESS',
        'LOGOUT_FAILURE',

        'START_PASSWORD_RECOVERY_SUCCESS',
        'START_PASSWORD_RECOVERY_FAILURE',

        'RESET_PASSWORD',
        'RESET_PASSWORD_SUCCESS',
        'RESET_PASSWORD_FAILURE'
    ])
};

'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('AUTH', [
        'LOGIN',
        'LOGIN_SUCCESS',
        'LOGIN_FAILURE',

        'LOGOUT',
        'LOGOUT_SUCCESS',
        'LOGOUT_FAILURE'
    ])
};

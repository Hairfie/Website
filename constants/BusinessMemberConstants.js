'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS_MEMBER', [
        'RECEIVE_BUSINESS',
        'RECEIVE_BUSINESS_SUCCESS',
        'RECEIVE_BUSINESS_FAILURE',

        'SAVE_SUCCESS',
        'SAVE_FAILURE'
    ])
};

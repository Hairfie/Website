'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS_SERVICE', [
        'SAVE',
        'SAVE_SUCCESS',
        'SAVE_FAILURE',

        'DELETE',
        'DELETE_SUCCESS',
        'DELETE_FAILURE',

        'RECEIVE_BUSINESS',
        'RECEIVE_BUSINESS_SUCCESS',
        'RECEIVE_BUSINESS_FAILURE'
    ])
};

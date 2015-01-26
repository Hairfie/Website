'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BOOKING', [
        'SAVE',
        'SAVE_SUCCESS',
        'SAVE_FAILURE',

        'RECEIVE',
        'RECEIVE_SUCCESS',
        'RECEIVE_FAILURE'
    ])
};

'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BOOKING', [
        'SAVE',
        'SAVE_SUCCESS',
        'SAVE_FAILURE',

        'OPEN',
        'OPEN_SUCCESS',
        'OPEN_FAILURE'
    ])
};
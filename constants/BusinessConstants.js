'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS', [
        'OPEN',
        'OPEN_SUCCESS',
        'OPEN_FAILURE',

        'RECEIVE_MANAGED'
    ])
};

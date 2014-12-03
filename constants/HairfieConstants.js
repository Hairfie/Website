'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('HAIRFIE', [
        'OPEN',
        'OPEN_SUCCESS',
        'OPEN_FAILURE',
        'LIST',
        'LIST_SUCCESS',
        'LIST_FAILURE'
    ])
};

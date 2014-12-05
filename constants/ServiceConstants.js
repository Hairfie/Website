'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('SERVICE', [
        'RECEIVE_ALL',
        'RECEIVE_ALL_SUCCESS',
        'RECEIVE_ALL_FAILURE'
    ])
};

'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS_SERVICE', [
        'RECEIVE_BUSINESS',
        'RECEIVE_BUSINESS_SUCCESS',
        'RECEIVE_BUSINESS_FAILURE'
    ])
};

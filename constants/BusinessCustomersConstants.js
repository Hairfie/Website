'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS_CUSTOMERS', [
        'RECEIVE_CUSTOMERS',
        'RECEIVE_CUSTOMERS_SUCCESS',
        'RECEIVE_CUSTOMERS_FAILURE'
    ])
};

'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('STATION', [
        'FETCH_FOR_BUSINESS',
        'FETCH_FOR_BUSINESS_SUCCESS',
        'FETCH_FOR_BUSINESS_FAILURE'
    ])
}
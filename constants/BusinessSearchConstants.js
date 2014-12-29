'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS_SEARCH', [
        'SEARCH',
        'SEARCH_SUCCESS',
        'SEARCH_FAILURE'
    ])
};
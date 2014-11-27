'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('BUSINESS_CLAIM', [
        'OPEN',
        'OPEN_SUCCESS',
        'OPEN_FAILURE',
    ]),
    Steps: define([
        'GENERAL',
        'ADDRESS',
        'MAP'
    ]),
    Kinds: define([
        'SALON',
        'HOME'
    ])
};

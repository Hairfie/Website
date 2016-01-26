'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Status: define([
        'REQUEST',
        'NOT_CONFIRMED',
        'IN_PROCESS',
        'CONFIRMED',
        'HONORED',
        'CANCELLED',
        'NOT_AVAILABLE',
        'NO_SHOW'
    ])
};

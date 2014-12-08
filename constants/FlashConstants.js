'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('FLASH', [
        'RECEIVE_MESSAGE',
        'CLOSE_MESSAGE'
    ])
};

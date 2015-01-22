'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('PICTURE', [
        'UPLOAD_START',
        'UPLOAD_PROGRESS',
        'UPLOAD_SUCCESS',
        'UPLOAD_FAILURE',
    ])
};

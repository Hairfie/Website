'use strict';

var _ = require('lodash');

function define(constants) {
    return _.zipObject(constants, constants);
}

module.exports = define;

'use strict';

var _ = require('lodash');

function define(namespace, constants) {
    if (!constants && _.isObject(namespace)) {
        constants = namespace;
        namespace = null;
    }

    var result = {};
    _.forEach(constants, function (constant) {
        result[constant] = namespace ? namespace + '.' + constant : constant;
    });

    return result;
}

module.exports = define;

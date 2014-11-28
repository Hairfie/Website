'use strict';

var _ = require('lodash');

module.exports = function (defs) {
    var handlers = {};

    _.forIn(defs, function (events, method) {
        if (!_.isArray(events)) events = [events];
        _.map(events, function (event) {
            handlers[event] = method;
        });
    });

    return handlers;
};

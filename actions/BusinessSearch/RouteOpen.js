'use strict';

var Search = require('./Search');

module.exports = function (context, payload, done) {
    context.executeAction(Search, {query: payload.query}, done);
};
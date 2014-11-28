'use strict';

var Open = require('./Open');

module.exports = function (context, payload, done) {
    context.executeAction(Open, {id: payload.params.id}, done);
};

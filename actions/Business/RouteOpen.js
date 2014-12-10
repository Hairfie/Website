'use strict';

var Open = require('./Open');

module.exports = function (context, payload, done) {
    context.executeAction(Open, {id: payload.params.id, slug: payload.params.slug}, done);
};

'use strict';

var Fetch = require('./Fetch');

module.exports = function (context, payload, done) {
    var bookingId = payload.params.bookingId || payload.params.id;

    context.executeAction(Fetch, {id: bookingId}, done);
};

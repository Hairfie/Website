'use strict';

var Fetch = require('./Fetch');

module.exports = function (context, payload, done) {
    var businessId = payload.params.businessId || payload.params.id;

    context.executeAction(Fetch, {id: businessId}, done);
};

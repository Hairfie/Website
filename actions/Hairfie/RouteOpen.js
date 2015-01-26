'use strict';

var Fetch = require('./Fetch');

module.exports = function (context, payload, done) {
    var hairfieId = payload.params.hairfieId || payload.params.id;

    context.executeAction(Fetch, {id: hairfieId}, done);
};

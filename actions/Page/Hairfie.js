'use strict';

var HairfieActions = require('../Hairfie');
var HairfieStore = require('../../stores/HairfieStore');

module.exports = function (context, payload, done) {
    var hairfieId = payload.params.hairfieId || payload.params.id;

    context.executeAction(HairfieActions.Fetch, {id: hairfieId}, function (error) {
        var hairfie = context.getStore(HairfieStore).getById(hairfieId);
        if (!hairfie) done({status: 404, message: 'Hairfie not found'});
        done();
    });
};

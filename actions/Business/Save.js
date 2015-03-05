'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;
var Notify = require('../Flash/Notify');


module.exports = function (context, payload, done) {
    var done = done || function () {};

    context
        .getHairfieApi()
        .saveBusiness(payload.business)
        .then(function (business) {
            context.dispatch(BusinessEvents.RECEIVE_SUCCESS, {
                id      : business.id,
                business: business
            });
            context.executeAction(Notify, {
                type: 'SUCCESS',
                body: 'Les modifications ont bien été sauvegardées.'
            });
            done();
        })
        .fail(function (error) {
            context.executeAction(Notify, {
                type: 'FAILURE',
                body: 'Un problème est survenu lors de la sauvegarde'
            }, function() {});

            done(error);
        });
};

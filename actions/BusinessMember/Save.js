'use strict';

var BusinessMemberEvents = require('../../constants/BusinessMemberConstants').Events;
var Notify = require('../Flash/Notify');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context
        .getHairfieApi()
        .saveBusinessMember(payload.businessMember)
        .then(function (businessMember) {
            context.dispatch(BusinessMemberEvents.SAVE_SUCCESS, {
                businessMember: businessMember
            });
            context.executeAction(Notify, {
                type: 'SUCCESS',
                body: 'La sauvegarde du membre de votre équipe a bien été effectuée.'
            }, function() {});

            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessMemberEvents.SAVE_FAILURE);

            var message = (error && error.error && error.error.message) ? error.error.message : null;

            context.executeAction(Notify, {
                type: 'FAILURE',
                body: 'Erreur lors de l\'enregistrement, veuillez vérifier la présence des champs obligatoire. \n' + message
            }, function() {});

            done(error);
        });
};

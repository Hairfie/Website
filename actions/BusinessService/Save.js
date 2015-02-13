'use strict';

var BusinessServiceEvents = require('../../constants/BusinessServiceConstants').Events;
var Notify = require('../Flash/Notify');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessServiceEvents.SAVE);
    context
        .getHairfieApi()
        .saveBusinessService(payload.businessService, context.getAuthToken())
        .then(function (businessService) {
            context.dispatch(BusinessServiceEvents.SAVE_SUCCESS, {
                businessService: businessService
            });

            context.executeAction(Notify, {
                type: 'SUCCESS',
                body: 'La sauvegarde de votre service a bien été effectuée.'
            }, function() {});

            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessServiceEvents.SAVE_FAILURE);

            var message = (error && error.error && error.error.message) ? error.error.message : null;
            context.executeAction(Notify, {
                type: 'FAILURE',
                body: 'Erreur lors de l\'enregistrement, veuillez vérifier la présence des champs obligatoire. \n' + message
            }, function() {});

            done(error);
        });
};

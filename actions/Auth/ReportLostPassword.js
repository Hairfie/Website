'use strict';

var Notify = require('../Flash/Notify');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context
        .getHairfieApi()
        .reportLostPassword(payload.email)
        .then(function () {
            context.executeAction(Notify, {
                type: 'SUCCESS',
                body: 'Un lien pour réinitialiser votre mot de passe a été envoyé par e-mail à '+payload.email+'.'
            });
        })
        .fail(function (error) {
            context.executeAction(Notify, {
                type: 'FAILURE',
                body: 'Une erreur est survenue lors de l\'envoie du lien, veuillez réessayer.'
            });
        });
};

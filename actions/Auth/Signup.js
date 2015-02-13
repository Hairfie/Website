'use strict';

var Events = require('../../constants/AuthConstants').Events;
var Notify = require('../Flash/Notify');
var BusinessActions = require('../Business');

module.exports = function (context, payload, done) {
    signupUser(context, payload.user)
        .then(function (result) {
            context.executeAction(BusinessActions.Claim, {
                business: payload.business
            }, done);
        })
        .fail(done);
};

function signupUser(context, userValues) {
    context.dispatch(Events.SIGNUP);

    return context
        .getHairfieApi()
        .signup(userValues)
        .then(function (result) {
            context.dispatch(Events.SIGNUP_SUCCESS, {
                user    : result.user,
                token   : result.token
            });

            return result;
        })
        .fail(function (error) {
            if (error.emailAlreadyExists) {
                context.executeAction(Notify, {
                    type: 'FAILURE',
                    body: 'L\'adresse email spécifiée est déjà associée à un utilisateur, veuillez vous authentifier.'
                });
            }

            context.dispatch(Events.SIGNUP_FAILURE, error);
        });
}

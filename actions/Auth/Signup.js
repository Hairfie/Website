'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var navigateAction = require('flux-router-component/actions/navigate');
var Events = require('../../constants/AuthConstants').Events;
var Notify = require('../Flash/Notify');

module.exports = function (context, payload, done) {
    signupUser(context, payload.user)
        .then(function (result) {
            return createBusiness(context, payload.business, result.token);
        })
        .then(function (business) {
            var path = context.router.makePath('pro_business', {id: business.id});
            context.executeAction(navigateAction, {path: path}, done);
        })
        .fail(done);
};

function signupUser(context, userValues) {
    context.dispatch(Events.SIGNUP);

    return hairfieApi
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

function createBusiness(context, businessValues, token) {
    return hairfieApi
        .saveBusinessClaim(businessValues, token)
        .then(function (claim) {
            return hairfieApi.submitBusinessClaim(claim, token);
        });
}

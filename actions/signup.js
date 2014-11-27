'use strict';

var hairfieApi = require('../services/hairfie-api-client');
var navigateAction = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    createUser(context, payload)
        .then(function (result) {
            return createBusinessClaim(context, payload, result.token);
        })
        .then(function (claim) {
            var path = context.router.makePath('pro_business_claim', {id: claim.id});
            context.executeAction(navigateAction, {path: path}, done);
        })
        .fail(done);
};

function createUser(context, payload) {
    return hairfieApi
        .login('antoine.herault@gmail.com', 'antoinepass', {
            gender      : payload.gender,
            firstName   : payload.firstName,
            lastName    : payload.lastName,
            email       : payload.email,
            password    : payload.password,
            phoneNumber : payload.phoneNumber
        })
        .then(function (result) {
            context.dispatch('RECEIVE_LOGIN_SUCCESS', {
                user    : result.user,
                token   : result.token
            })

            return result;
        });
}

function createBusinessClaim(context, payload, token) {
    var values = {};
    values.name = payload.businessName;

    return hairfieApi.saveBusinessClaim(values, token);
}

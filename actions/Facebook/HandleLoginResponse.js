'use strict';

var AuthEvents = require('../../constants/AuthConstants').Events;
var handleLoginResponse = require('./utils').handleLoginResponse;
var authStorage = require('../../services/auth-storage');
var Navigate = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    handleLoginResponse(payload.response)
        .then(function (token) {
            return context.getHairfieApi().loginWithFacebookToken(token);
        })
        .then(function (result) {
            authStorage.setToken(result.token);

            context.dispatch(AuthEvents.LOGIN_SUCCESS, {
                user    : result.user,
                token   : result.token
            });

            if (payload.successUrl) {
                return context.executeAction(Navigate, {url: payload.successUrl}, done);
            }

            done();
        })
        .fail(done);
};

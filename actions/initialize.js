'use strict';

var Promise = require('q');
var authStorage = require('../services/auth-storage');
var hairfieApi = require('../services/hairfie-api-client');
var navigateAction = require('flux-router-component').navigateAction;

module.exports = function (context, payload, done) {
    var request = payload.request;

    authenticateRequest(context, request)
        .then(navigate(context, request))
        .then(done.bind(null, null), done);
}

function authenticateRequest(context, request) {
    var token = authStorage.getToken(request);

    return token ? loginWithAuthToken(context, token) : new Promise();
}

function loginWithAuthToken(context, token) {
    return hairfieApi
        .getUser(token.userId, token)
        .then(
            function (user) {
                context.dispatch('RECEIVE_LOGIN_SUCCESS', {
                    user    : user,
                    token   : token
                });
            },
            function () {
                context.dispatch('RECEIVE_LOGIN_FAILURE');
            }
        );
}

function navigate(context, request) {
    var payload = {};
    payload.path = request.path;

    return function () {
        var deferred = Promise.defer();

        context.executeAction(navigateAction, payload, function (error) {
            if (error && (!error.status || error.status != 404)) {
                return deferred.reject(error);
            }
            deferred.resolve();
        });

        return deferred.promise;
    };
}

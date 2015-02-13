'use strict';

var Promise = require('q');
var authStorage = require('../../services/auth-storage');
var navigateAction = require('flux-router-component').navigateAction;
var AuthEvents = require('../../constants/AuthConstants').Events;
var UserEvents = require('../../constants/UserConstants').Events;
var BusinessActions = require('../../actions/Business');

module.exports = function (context, payload, done) {
    var request = payload.request;

    authenticateRequest(context, request)
        .then(navigate(context, request))
        .then(done.bind(null, null), done);
}

function authenticateRequest(context, request) {
    var token = authStorage.getToken(request);

    return token ? loginWithAuthToken(context, token) : Promise();
}

function loginWithAuthToken(context, token) {
    return context
        .getHairfieApi()
        .getUser(token.userId, {token: token})
        .then(function (user) {
                return context
                    .getHairfieApi()
                    .getManagedBusinesses(user, {token: token})
                    .then(function (businesses) {
                        context.dispatch(AuthEvents.LOGIN_SUCCESS, {
                            user    : user,
                            token   : token
                        });
                        context.dispatch(UserEvents.RECEIVE_MANAGED_BUSINESSES_SUCCESS, {
                            user                : user,
                            managedBusinesses   : businesses
                        });
                    });
        })
        .fail(function () {
            context.dispatch(AuthEvents.LOGIN_FAILURE);
        });
}

function navigate(context, request) {
    var payload = {};
    payload.url = request.url;

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

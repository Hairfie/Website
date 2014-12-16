'use strict';

var Promise = require('q');
var AuthEvents = require('../../constants/AuthConstants').Events;
var LoginStatus = require('../../constants/FacebookConstants').LoginStatus;
var Facebook = require('../../services/facebook');
var hairfieApi = require('../../services/hairfie-api-client');
var authStorage = require('../../services/auth-storage');
var scope = require('../../configs/facebook').SCOPE;

module.exports = function (context, payload, done) {
    Facebook
        .load()
        .then(function (fb) {
            return getFacebookToken(fb, payload.scope || scope || []);
        })
        .then(function (token) {
            return hairfieApi.loginWithFacebookToken(token);
        })
        .then(function (result) {
            authStorage.setToken(result.token);

            context.dispatch(AuthEvents.LOGIN_SUCCESS, {
                user    : result.user,
                token   : result.token
            });
            done();
        })
        .fail(function (error) {
            console.log(error);
            done(error);
        });
};

function getFacebookToken(fb, scope) {
    return getLoginStatus(fb, scope)
        .then(function (result) {
            if (LoginStatus.CONNECTED == result.status) {
                return result.authResponse.accessToken;
            }

            var deferred = Promise.defer();

            fb.login(function (result) {
                if (LoginStatus.CONNECTED == result.status) {
                    deferred.resolve(result.authResponse.accessToken);
                } else {
                    deferred.reject(new Error('Not granted by user'));
                }
            }, {scope: scope});

            return deferred.promise;
        });
}

function getLoginStatus(fb, scope) {
    var deferred = Promise.defer();

    fb.getLoginStatus(function (result) {
        deferred.resolve(result);
    });

    return deferred.promise;
}

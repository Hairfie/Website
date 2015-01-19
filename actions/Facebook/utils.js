'use strict';

var Promise = require('q');
var LoginStatus = require('../../constants/FacebookConstants').LoginStatus;
var config = require('../../configs/facebook');
var _ = require('lodash');

module.exports = {
    login              : login,
    handleLoginResponse: handleLoginResponse
};

function login(fb, scope) {
    var deferred = Promise.defer();

    fb.login(function (result) {
        handleLoginResponse(result).then(deferred.resolve, deferred.reject);
    }, {scope: scopeString(scope || config.SCOPE)});

    return deferred.promise;
}

function handleLoginResponse(response) {
    if (LoginStatus.CONNECTED == response.status) {
        return Promise.resolve(response.authResponse.accessToken);
    } else {
        return Promise.reject(new Error('Not granted by user'));
    }
}

function scopeString(scope) {
    if (Array.isArray(scope)) return scope.join(',');
    return scope;
}

function scopeArray(scope) {
    if (Array.isArray(scope)) return scope;
    if (typeof scope == "string") return
    return []; // kinda optimistic...
}

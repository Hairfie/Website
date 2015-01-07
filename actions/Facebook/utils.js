'use strict';

var Promise = require('q');
var LoginStatus = require('../../constants/FacebookConstants').LoginStatus;
var config = require('../../configs/facebook');
var _ = require('lodash');

module.exports = {
    login: login
};

function login(fb, scope) {
    var deferred = Promise.defer();
    console.log("utils, login");
    fb.login(function (result) {
        console.log("inside login");

        if (LoginStatus.CONNECTED == result.status) {
            deferred.resolve(result.authResponse.accessToken);
        } else {
            deferred.reject(new Error('Not granted by user'));
        }
    }, {scope: scopeString(scope || config.SCOPE)});

    return deferred.promise;
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

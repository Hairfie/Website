'use strict';

var Promise = require('q');
var AuthEvents = require('../../constants/AuthConstants').Events;
var Facebook = require('../../services/facebook');
var login = require('./utils').login;
var hairfieApi = require('../../services/hairfie-api-client');
var authStorage = require('../../services/auth-storage');

module.exports = function (context, payload, done) {
    Facebook
        .load()
        .then(function (fb) {
            return login(fb, payload.scope)
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

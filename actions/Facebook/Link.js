'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var Facebook = require('../../services/facebook');
var login = require('./utils').login;

module.exports =  function (context, payload, done) {
    Facebook
        .load()
        .then(function (fb) {
            return login(fb, payload.scope);
        })
        .then(function (token) {
            return hairfieApi.linkFacebookToken(token, context.getAuthToken());
        })
        .then(function () {
            done();
        })
        .fail(function (error) {
            done(error);
        });
};

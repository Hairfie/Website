'use strict';

var handleLoginResponse = require('./utils').handleLoginResponse;
var Facebook = require('../../services/facebook');
var FacebookEvents = require('../../constants/FacebookConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    handleLoginResponse(payload.response)
        .then(function (token) {
            Facebook.load()
                .then(function (fb) {
                    fb.getLoginStatus(function (loginStatus) {
                        context.dispatch(FacebookEvents.RECEIVE_LOGIN_STATUS, {
                            loginStatus         : loginStatus,
                            refreshPermissions  : true,
                            refreshManagedPages : true
                        });
                    });
                });

            return token;
        })
        .then(function (token) {
            return context.getHairfieApi().linkFacebookToken(token);
        })
        .then(done.bind(null, null), done);
};

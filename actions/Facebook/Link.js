'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var Facebook = require('../../services/facebook');
var FacebookEvents = require('../../constants/FacebookConstants').Events;
var login = require('./utils').login;
var RefreshPermissions = require('./RefreshPermissions');

module.exports =  function (context, payload, done) {
    Facebook
        .load()
        .then(function (fb) {
            return login(fb, payload.scope)
                .then(function(token) {
                    // dispatch status to refresh permissions
                    // TODO: dispatch a dedicated event?
                    fb.getLoginStatus(function (loginStatus) {
                        context.dispatch(FacebookEvents.RECEIVE_LOGIN_STATUS, {
                            loginStatus         : loginStatus,
                            refreshPermissions  : true
                        });
                    });

                    return token;
                });
        })
        .then(function (token) {
            return hairfieApi.linkFacebookToken(token, context.getAuthToken());
        })
        .then(done.bind(null, null), done);
};

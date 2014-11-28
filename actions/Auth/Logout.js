'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var authStorage = require('../../services/auth-storage');
var Events = require('../../constants/AuthConstants').Events;

module.exports = function (context, payload, done) {
    var token = context.getAuthToken();
    if (token) {
        hairfieApi.logout(token);
        authStorage.clearToken();
        context.dispatch(Events.LOGOUT_SUCCESS);
    }
    done();
};

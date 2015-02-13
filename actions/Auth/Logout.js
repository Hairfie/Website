'use strict';

var authStorage = require('../../services/auth-storage');
var Events = require('../../constants/AuthConstants').Events;

module.exports = function (context, payload, done) {
    var token = context.getAuthToken();
    if (token) {
        context.getHairfieApi().logout();
        authStorage.clearToken();
        context.dispatch(Events.LOGOUT_SUCCESS);
    }
    done();
};

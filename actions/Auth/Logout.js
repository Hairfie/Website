'use strict';

var authStorage = require('../../services/auth-storage');
var Events = require('../../constants/AuthConstants').Events;
var Navigate = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    var token = context.getAuthToken();
    if (token) {
        context.getHairfieApi().logout();
        authStorage.clearToken();
        context.dispatch(Events.LOGOUT_SUCCESS);
    }
    context.executeAction(Navigate, {url: context.router.makePath('home')}, done);
};

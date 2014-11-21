'use strict';

var hairfieApi = require('../services/hairfie-api-client');
var authStorage = require('../services/auth-storage');

var AuthStore = require('../stores/AuthStore');

module.exports = function (context, payload, done) {
    // TODO: is it ok to read data from a store?
    var token = context.getStore(AuthStore).getToken();

    if (token) {
        hairfieApi.logout(token);
        authStorage.clearToken();

        context.dispatch('RECEIVE_LOGOUT_SUCCESS');
    }
    done();
};

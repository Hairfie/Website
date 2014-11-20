'use strict';

var hairfieApi = require('../services/hairfie-api-client');

var AuthStore = require('../stores/AuthStore');

module.exports = function (context, payload, done) {
    // TODO: is it ok to read data from a store?
    var token = context.getStore(AuthStore).getToken();

    if (token) {
        hairfieApi.logout(token);
        context.dispatch('RECEIVE_LOGOUT_SUCCESS');
    }
    done();
};

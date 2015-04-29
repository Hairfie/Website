'use strict';

var Promise = require('q');
var navigateAction = require('flux-router-component').navigateAction;

module.exports = function (context, payload, done) {
    var request = payload.request;

    var payload = {};
    payload.url = request.url;

    context.executeAction(navigateAction, payload, done);
}

'use strict';

var ServiceEvents = require('../../constants/ServiceConstants').Events;
var hairfieApi = require('../../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    context.dispatch(ServiceEvents.RECEIVE_ALL);

    hairfieApi
        .getServices()
        .then(function (services) {
            context.dispatch(ServiceEvents.RECEIVE_ALL_SUCCESS, {
                services: services
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(ServiceEvents.RECEIVE_ALL_FAILURE);
            done(error);
        });
};

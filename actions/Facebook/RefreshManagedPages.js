'use strict';

var Promise = require('q');
var Facebook = require('../../services/facebook');
var FacebookEvents = require('../../constants/FacebookConstants').Events;

module.exports = function (context, payload, done) {
    Facebook
        .load()
        .then(getManagedPages)
        .then(function (managedPages) {
            context.dispatch(FacebookEvents.RECEIVE_MANAGED_PAGES, {
                managedPages: managedPages
            });
            done();
        })
        .fail(function (error) {
            done(error);
        });
};

function getManagedPages(fb) {
    var deferred = Promise.defer();

    var timeoutHandler = setTimeout(function () {
        deferred.reject(new Error('Timeout'));
    }, 1000);

    fb.api('/me/accounts?limit=1000', function (result) {
        clearTimeout(timeoutHandler);
        deferred.resolve(result.data);
    });

    return deferred.promise;
};

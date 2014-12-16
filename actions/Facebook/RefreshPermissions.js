'use strict';

var Facebook = require('../../services/facebook');
var FacebookEvents = require('../../constants/FacebookConstants').Events;

module.exports = function (context, payload, done) {
    Facebook
        .load()
        .then(getPermissions)
        .then(function (permissions) {
            context.dispatch(FacebookEvents.RECEIVE_PERMISSIONS, {
                permissions: permissions
            });
            done();
        })
        .fail(function (error) {
            done(error);
        });
};

function getPermissions(fb) {
    var deferred = Promise.defer();

    var timeoutHandler = setTimeout(function () {
        deferred.reject(new Error('Timeout'));
    }, 1000);

    fb.api('/me/permissions', function (result) {
        clearTimeout(timeoutHandler);
        deferred.resolve(result.data);
    });

    return deferred.promise;
}

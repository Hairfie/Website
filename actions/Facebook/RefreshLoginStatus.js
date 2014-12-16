'use strict';

var Promise = require('q');
var Facebook = require('../../services/facebook');
var FacebookEvents = require('../../constants/FacebookConstants').Events;

module.exports = function (context, payload, done) {
    Facebook
        .load()
        .then(getLoginStatus)
        .then(function (loginStatus) {
            context.dispatch(FacebookEvents.RECEIVE_LOGIN_STATUS, {
                loginStatus: loginStatus
            });
            done();
        })
        .fail(function (error) {
            done(error);
        });
};

function getLoginStatus(fb) {
    var deferred = Promise.defer();

    var timeoutHandler = setTimeout(function() {
        deferred.reject(new Error('Timeout'));
    }, 1000);

    fb.getLoginStatus(function (result) {
        clearTimeout(timeoutHandler);
        deferred.resolve(result);
    });

    return deferred.promise;
}

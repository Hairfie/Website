'use strict';

var Promise = require('q');
var _ = require('lodash');
var debug = require('debug')('Service:Google');

var deferreds = [];
var loading = false;

function loadMaps() {
    var deferred = Promise.defer();

    if (typeof window === 'undefined') {
        debug('non-browser environment, aborting google maps SDK loading');
        deferred.reject(new Error('Not in browser'));
        return deferred.promise
    }

    if (window.google && window.google.maps) {
        debug('google maps SDK already loaded, resolving promise');
        deferred.resolve(window.google);
        return deferred.promise;
    }

    deferreds.push(deferred);

    if (!loading) {
        loading = true;
        debug('start loading google maps SDK');
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=onGoogleMapsLoaded';
        document.body.appendChild(script);
        window.onGoogleMapsLoaded = onGoogleMapsLoaded;
    }

    return deferred.promise;
}

function onGoogleMapsLoaded() {
    debug('finished loading google SDK, resolving promises');
    _.invoke(deferreds, 'resolve', window.google);
    deferreds = [];
}

module.exports = {
    loadMaps: loadMaps
};

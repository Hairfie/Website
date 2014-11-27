'use strict';

var Google = require('./google');
var Promise = require('q');
var debug = require('debug')('Service:Geocoder');

module.exports = {
    getAddressLocation: getAddressLocation
};

var geocoder;
var google;
var GeocoderStatus;

function getGeocoder() {
    if (geocoder) return Promise(geocoder);

    return Google
        .loadMaps()
        .then(function (google) {
            google = google;
            geocoder = new google.maps.Geocoder();
            GeocoderStatus = google.maps.GeocoderStatus;

            debug('geocoder loaded');

            return geocoder;
        });
}

function geocode(request) {
    return getGeocoder()
        .then(function (geocoder) {
            var deferred = Promise.defer();

            debug('sending requset to geocoding service');
            geocoder.geocode(request, function (results, code) {
                if (!isGeocoderStatusAcceptable(code)) {
                    var statusString = getGeocoderStatusString(code);
                    debug('received "' + statusString + '" error response from geocoding service');
                    deferred.reject(new Error(statusString));
                    return;
                }

                debug('received ' + results.length + ' result(s)');

                deferred.resolve(results);
            });

            return deferred.promise;
        })
    ;
}

function getAddressLocation(address) {
    var addressString = addressToString(address);
    debug('requesting location for address "' + addressString + '"');
    return geocode({address: addressToString(address)})
        .then(function (results) {
            if (0 == results.length || !results[0].geometry || !results[0].geometry.location) {
                debug('no location found');
                throw new Error('No location found');
            }

            var location = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };

            debug('returning result location LAT=' + location.lat + ' LNG=' + location.lng);

            return location;
        });
}

function addressToString(address) {
    return (address.street || '') + ', ' +
           (address.zipCode || '') + ' ' + (address.city || '') + ', ' +
           (address.country || '');
}

function isGeocoderStatusAcceptable(code) {
    return GeocoderStatus.OK == code || GeocoderStatus.ZERO_RESULTS == code;
}

function getGeocoderStatusString(code) {
    switch (code) {
        case GeocoderStatus.ERROR:
            return 'ERROR';
        case GeocoderStatus.INVALID_REQUEST:
            return 'INVALID_REQUEST';
        case GeocoderStatus.OK:
            return 'OK';
        case GeocoderStatus.OVER_QUERY_LIMIT:
            return 'OVER_QUERY_LIMIT';
        case GeocoderStatus.REQUEST_DENIED:
            return 'REQUEST_DENIED';
        case GeocoderStatus.UNKNOWN_ERROR:
            return 'UNKNOWN_ERROR';
        case GeocoderStatus.ZERO_RESULTS:
            return 'ZERO_RESULTS';
    }
}

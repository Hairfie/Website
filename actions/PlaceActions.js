'use strict';

var _ = require('lodash');
var Actions = require('../constants/Actions');
var q = require('q');
var request = require('superagent');

module.exports = {
    loadAddressPlace: function (context, address) {
        return context.hairfieApi
            .get('/places', { query: { address: address } })
            .then(function (places) {
                context.dispatch(Actions.RECEIVE_ADDRESS_PLACE, {
                    address : address,
                    place   : _.first(places)
                });
            });
    },
    getPlaceByGeolocation: function (context) {
        var deferred = q.defer();

        if (navigator.geolocation) {
            return navigator.geolocation.getCurrentPosition(function(position) {
                request
                    .get('https://maps.googleapis.com/maps/api/geocode/json')
                    .query({
                        latlng: position.coords.latitude + ',' + position.coords.longitude,
                        sensor: true
                    })
                    .end(function (error, response) {
                        if (!error && response.body.results[0] && response.body.results[0].formatted_address) {
                            deferred.resolve(response.body.results[0].formatted_address);
                        }
                        else {
                            if (error) {
                                return deferred.reject(error);
                            }
                            else {
                                return deferred.reject("Une erreur est survenu");
                            }
                        }
                    });
            });
        }
        else {
            deffered.reject("Geolocation is not supported by this browser.");
        }
        return deferred.promise;
    }
};

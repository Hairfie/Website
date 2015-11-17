'use strict';

var _ = require('lodash');
var Actions = require('../constants/Actions');
var q = require('q');
var request = require('superagent');
var NotificationActions = require('./NotificationActions');

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
                            context.dispatch(Actions.RECEIVE_CURRENT_POSITION, response.body.results[0].formatted_address)
                        }
                        else {
                            if (error) {
                                context.executeAction(
                                    NotificationActions.notifyError,
                                    {
                                        title: 'Erreur durant la localisation',
                                        message: "Message d'erreur : " + error
                                    }
                                );
                            }
                            else {
                                context.executeAction(
                                    NotificationActions.notifyError,
                                    {
                                        title: 'Erreur durant la localisation',
                                        message: "Une erreur est survenu"
                                    }
                                );
                            }
                        }
                    });
            });
        }
        else {
            context.executeAction(
                NotificationActions.notifyWarning,
                {
                    title: 'Erreur durant la localisation',
                    message: "Votre navigateur n'est apparemment pas compatible avec la géolocalisation"
                }
            );
        }
    }
};

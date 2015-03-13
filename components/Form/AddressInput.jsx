/** @jsx React.DOM */

'use strict';

var React = require('react');
var PlaceAutocompleteInput = require('./PlaceAutocompleteInput.jsx');

module.exports = React.createClass({
    render: function () {
        return <PlaceAutocompleteInput ref="input" {...this.props} />
    },
    getAddress: function () {
        return addressFromPlace(this.refs.input.getPlace());
    },
    getGps: function () {
        return gpsFromPlace(this.refs.input.getPlace());
    }
});

function addressFromPlace(place) {
    var parts = {};

    if (place && place.address_components) {
        place.address_components.map(function (component) {
            switch (component.types[0]) {
                case 'street_number':
                    parts.streetNumber = component.short_name;
                    break;
                case 'route':
                    parts.streetName = component.long_name;
                    break;
                case 'locality':
                    parts.city = component.long_name;
                    break;
                case 'postal_code':
                    parts.zipCode = component.short_name;
                    break;
                case 'country':
                    parts.country = component.short_name;
                    break;
            }
        });
    }

    return {
        street  : [parts.streetNumber, parts.streetName].join(' '),
        city    : parts.city,
        zipCode : parts.zipCode,
        country : parts.country
    };
}

function gpsFromPlace(place) {
    if (place && place.geometry && place.geometry.location) {
        return {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
    }
}

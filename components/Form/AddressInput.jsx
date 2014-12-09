/** @jsx React.DOM */

'use strict';

var React = require('react');
var Input = require('react-bootstrap/Input');
var Google = require('../../services/google');

module.exports = React.createClass({
    componentDidMount: function () {
        Google
            .loadMaps()
            .then(function (google) {
                var input = this.refs.input.getInputDOMNode();

                var options = {};
                options.types = ['geocode'];

                var autocomplete = new google.maps.places.Autocomplete(input, options);

                google.maps.event.addListener(autocomplete, 'place_changed', this.handlePlaceChanged);

                this.setState({
                    autocomplete: autocomplete
                });
            }.bind(this));
    },
    getInitialState: function () {
        return {
            address     : null,
            gps         : null,
            autocomplete: null
        }
    },
    render: function () {
        return <Input ref="input" {...this.props} type="text" />
    },
    handlePlaceChanged: function () {
        var place = this.state.autocomplete.getPlace();

        this.setState({
            address : addressFromPlace(place),
            gps     : gpsFromPlace(place)
        });
    },
    getAddress: function () {
        return this.state.address;
    },
    getGps: function () {
        return this.state.gps;
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

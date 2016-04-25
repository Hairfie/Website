'use strict';

var React = require('react');
var Promise = require('q');

module.exports = React.createClass({
    contextTypes: {
        getGoogleMapsScript: React.PropTypes.func
    },
    propTypes: {
        types: React.PropTypes.array,
        onPlaceChanged: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            place: null
        };
    },
    getDefaultProps: function () {
        return {
            types: ['geocode'],
            onPlaceChanged: function () {}
        };
    },
    componentDidMount: function () {
        this.context.getGoogleMapsScript().then(function (google) {
            var input = this.refs.input;

            var options = {
                componentRestrictions: {
                    country: 'fr'
                }
            };
            options.types = this.props.types;

            this.autocomplete = new google.maps.places.Autocomplete(input, options);
            this.service = new google.maps.places.AutocompleteService();

            google.maps.event.addListener(this.autocomplete, 'place_changed', this.handlePlaceChanged);
        }.bind(this));
    },
    render: function () {
        return <input ref="input" {...this.props} type="search" className={this.props.className} />
    },
    handlePlaceChanged: function () {
        var place = this.autocomplete.getPlace();
        this.setState({place: null}, function() {
            console.log("place", place);
            this.refs.input.value = place.formatted_address;
        });
        this.props.onPlaceChanged(place);
    },
    getFormattedAddress: function () {
        if(this.state.place) return this.state.place.description;

        var place = this.autocomplete.getPlace();

        if(!place) return this.refs.input.value;
        return place.formatted_address;
    },
    getPlace: function () {
        return this.autocomplete.getPlace();
    },
    setPlace: function(city, callback) {
        var request = {
           input: city,
           componentRestrictions: {country: 'fr'},
        };
        this.service.getPlacePredictions(request, function(res) {
            this.setState({place: res[0]}, callback);
        }.bind(this));
    }
});

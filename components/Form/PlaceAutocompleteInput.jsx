'use strict';

var React = require('react');

module.exports = React.createClass({
    contextTypes: {
        getGoogleMapsScript: React.PropTypes.func
    },
    propTypes: {
        types: React.PropTypes.array,
        onPlaceChanged: React.PropTypes.func
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
                components: {
                    country: 'fr'
                }
            };
            options.types = this.props.types;

            this.autocomplete = new google.maps.places.Autocomplete(input, options);
            google.maps.event.addListener(this.autocomplete, 'place_changed', this.handlePlaceChanged);
        }.bind(this));
    },
    render: function () {
        return <input ref="input" {...this.props} type="search" className={this.props.className} />
    },
    handlePlaceChanged: function () {
        var place = this.autocomplete.getPlace();
        this.props.onPlaceChanged(place);
    },
    getFormattedAddress: function () {
        var place = this.autocomplete.getPlace();
        if(!place) return this.refs.input.value;
        return place.formatted_address;
    },
    getPlace: function () {
        return this.autocomplete.getPlace();
    }
});

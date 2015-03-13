/** @jsx React.DOM */

'use strict';

var React = require('react');
var Input = require('react-bootstrap/Input');
var Google = require('../../services/google');

module.exports = React.createClass({
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
        Google
            .loadMaps()
            .then(function (google) {
                var input = this.refs.input.getInputDOMNode();

                var options = {};
                options.types = this.props.types;

                var autocomplete = new google.maps.places.Autocomplete(input, options);

                google.maps.event.addListener(autocomplete, 'place_changed', this.handlePlaceChanged);

                this.setState({
                    autocomplete: autocomplete
                });
            }.bind(this));
    },
    getInitialState: function () {
        return {
            autocomplete: null
        }
    },
    render: function () {
        return <Input ref="input" {...this.props} type="text" />
    },
    handlePlaceChanged: function () {
        var place = this.state.autocomplete.getPlace();
        this.props.onPlaceChanged(place);
    },
    getValue: function () {
        return this.refs.input.getValue();
    },
    getFormattedAddress: function () {
        var place = this.state.autocomplete.getPlace();
        return place.formatted_address;
    },
    getPlace: function () {
        return this.state.autocomplete.getPlace();
    }
});

/** @jsx React.DOM */

'use strict';

var React = require('react');
var Google = require('../../services/google');

module.exports = React.createClass({
    componentDidMount: function () {
        Google
            .loadMaps()
            .then(function (google) {
                this.map = new google.maps.Map(this.refs.map.getDOMNode(), {
                    zoom: 16,
                    center: new google.maps.LatLng(this.props.location.lat, this.props.location.lng)
                });
                this.marker = new google.maps.Marker({
                    map: this.map,
                    position: this.map.getCenter()
                });
            }.bind(this));
    },
    render: function () {
        return (
            <div ref="map" {...this.props} />
        );
    }
});

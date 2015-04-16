'use strict';

var React = require('react');
var Google = require('../services/google');

module.exports = React.createClass({
    componentDidMount: function () {
        createMap(this.refs.map.getDOMNode(), this.props.marker)
            .then(function (map) {
                return createMarker(map, this.props.marker.title);
            }.bind(this));
    },
    render: function () {
        return (
            <div id="gmap-business" ref="map" />
        );
    }
});

function createMap(el, center) {
    var options = {
        zoom: 16
    };

    return Google
        .loadMaps()
        .then(function (google) {
            options.center = new google.maps.LatLng(center.lat, center.lng);
            return new google.maps.Map(el, options);
        });
}

function createMarker(map, markerTitle) {
    var options = {};
    options.map = map;
    options.position = map.getCenter();
    options.title = markerTitle;
    options.draggable = false;

    return Google
        .loadMaps()
        .then(function (google) {
            var marker = new google.maps.Marker(options);
            return marker;
        });
}

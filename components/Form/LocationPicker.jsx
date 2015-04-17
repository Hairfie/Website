'use strict';

var React = require('react');
var Promise = require('q');

var Google = require('../../services/google');

var DEFAULT_LOCATION = {lat: 48.867439, lng: 2.343644};

module.exports = React.createClass({
    getInitialState: function () {
        return {
            location        : this.props.defaultLocation || DEFAULT_LOCATION,
            map             : null,
            marker          : null,
            markerHasMoved  : false
        }
    },
    componentDidMount: function () {
        createMap(this.refs.map.getDOMNode())
            .then(function (map) {
                this.setState({map: map});
                return createMarker(map, this.onMarkerMoved);
            }.bind(this))
            .then(function (marker) {
                this.setState({marker: marker});
            }.bind(this));
    },
    render: function () {
        this.updateMap();

        return <div ref="map" style={{width:this.props.width, height:this.props.height}} />
    },
    updateMap: function () {
        if (this.state.map && !this.state.markerHasMoved) {
            this.state.map.panTo(this.state.location);
        }
        if (this.state.marker) {
            this.state.marker.setPosition(this.state.location);
        }
    },
    onMarkerMoved: function () {
        this.setState({
            markerHasMoved: true,
            location      : {
                lat: this.state.marker.position.lat(),
                lng: this.state.marker.position.lng()
            }
        });

        this.props.onChange();
    },
    getLocation: function () {
        return this.state.location;
    }
});

function createMap(el) {
    var options = {};
    options.zoom = 16;

    return Google
        .loadMaps()
        .then(function (google) {
            return new google.maps.Map(el, options);
        });
}

function createMarker(map, onMoved) {
    var options = {};
    options.map = map;
    options.position = map.getCenter();
    options.draggable = true;

    return Google
        .loadMaps()
        .then(function (google) {
            var marker = new google.maps.Marker(options);
            google.maps.event.addListener(marker, 'dragend', onMoved);
            return marker;
        });
}

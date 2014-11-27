/** @jsx React.DOM */

var React = require('react');
var Promise = require('q');

var Google = require('../../services/google');
var Geocoder = require('../../services/geocoder');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            location: {lat: 48.867439, lng: 2.343644},
            map: null,
            marker: null,
            markerHasMoved: false
        }
    },
    componentWillMount: function () {
        Geocoder.getAddressLocation(this.props.businessClaim.address)
            .then(function (location) {
                this.setState({location: location})
            }.bind(this));
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

        return (
            <div>
                <div ref="map" style={{width:'600', height:'400'}} />
            </div>
        );
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
            location: {
                lat: this.state.marker.position.lat(),
                lng: this.state.marker.position.lng()
            }
        });
    },
    applyChanges: function () {
        this.props.businessClaims.gps = this.state.location;
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

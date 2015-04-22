'use strict';

var React = require('react');
var Google = require('../../services/google');

module.exports = React.createClass({
    getDefaultProps: function () {
        return {
            defaultZoom: 16
        };
    },
    componentDidMount: function () {
        Google
            .loadMaps()
            .then(function (google) {

                this.map = new google.maps.Map(this.refs.map.getDOMNode(), {
                    zoom: this.props.defaultZoom,
                    center: this._getLatLng()
                });
                this.marker = new google.maps.Marker({
                    map: this.map,
                    position: this.map.getCenter()
                });
            }.bind(this));
    },
    componentWillReceiveProps: function (nextProps) {
        Google
            .loadMaps()
            .then(function (google) {
                if(this.map) {
                    this.map.setCenter(this._getLatLng(nextProps));
                    this.map.setZoom(nextProps.defaultZoom);
                    this.marker.setPosition(this._getLatLng(nextProps));
                } else {
                    this.map = new google.maps.Map(this.refs.map.getDOMNode(), {
                        zoom: nextProps.defaultZoom,
                        center: this._getLatLng()
                    });
                    this.marker = new google.maps.Marker({
                        map: this.map,
                        position: this._getLatLng(nextProps)
                    });
                }
            }.bind(this));
    },
    render: function () {
        return (
            <div ref="map" {...this.props} />
        );
    },
    _getLatLng: function (props) {
        var props = props || this.props;
        var loc = new google.maps.LatLng(props.location.lat, props.location.lng)

        return loc;
    }
});

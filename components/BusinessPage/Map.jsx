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
        console.log("componentDidMount");
        Google
            .loadMaps()
            .then(function (google) {
                console.log("google loaded");
                console.log("this.refs.map.getDOMNode()", this.refs.map.getDOMNode());
                console.log("zoom", this.props.defaultZoom);
                console.log("props", this.props);
                console.log("center", this._getLatLng());

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
                        center: this._getLatLng(nextProps)
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
        console.log("_getLatLng", loc);

        return loc;
    }
});

'use strict';

var React = require('react');

var Map = React.createClass({
    contextTypes: {
        getGoogleMapsScript: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            defaultZoom: 16
        };
    },
    componentDidMount: function () {
        this.context.getGoogleMapsScript().then(function (google) {
            this._setupMap(google, this.props);
        }.bind(this));
        scrollToMap()
    },
    scrollToMap: function () {


    },
    componentWillReceiveProps: function (nextProps) {
        this.context.getGoogleMapsScript()
            .then(function (google) {
                if(this.map) {
                    this._updateMap(google, nextProps);
                } else {
                    this._setupMap(google, nextProps);
                }
            }.bind(this));
    },
    render: function () {
        return (
            <div ref="map" {...this.props} />
        );
    },
    _setupMap: function (google, props) {
        this.map = new google.maps.Map(this.refs.map.getDOMNode(), {
            zoom    : props.defaultZoom,
            center  : this._getLatLng(google, props)
        });
        this.marker = new google.maps.Marker({
            map     : this.map,
            position: this.map.getCenter()
        });
    },
    _updateMap: function (google, props) {
        this.map.setCenter(this._getLatLng(google, props));
        this.map.setZoom(props.defaultZoom);
        this.marker.setPosition(this._getLatLng(google, props));
    },
    _getLatLng: function (google, props) {
        return new google.maps.LatLng(props.location.lat, props.location.lng)
    }
});

module.exports = Map;

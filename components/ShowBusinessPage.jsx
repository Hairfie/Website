/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var BusinessStore = require('../stores/BusinessStore');
var PublicLayout = require('./PublicLayout.jsx');
var Map = require('./MapComponent.jsx');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getBusiness(),
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business;

        if(!business) {
            return (
                <div>Loading Business in progress</div>
            );
        } else {
            var address;
            if (business.address) {
                address = (
                    <span className="content">
                        {business.address.street} <br />
                        {business.address.zipCode} {business.address.city}
                    </span>
                )
            } else {
                address = (
                    <p>
                        Information not available
                    </p>
                )
            }

            var mapElement;
            if (business.gps) {
                mapElement = <Map marker={{lat: business.gps.lat, lng: business.gps.lng, title: business.name}} />
            }

            return (
                <PublicLayout context={this.props.context}>
                    <div className="row" id="business-header">
                        <div className="col-md-3 col-md-offset-1 col-sm-3 col-sm-offset-1 col-xs-3 col-offset-1 pictures">
                            <img src={business.pictures[0].url + '?height=300&width=300'} className="img-rounded img-responsive"/>
                        </div>
                        <div className="col-md-4 col-sm-3 col-xs-8 infos">
                            <h1>{business.name}</h1>
                            <p className="info address">
                                <span className="icon icon-address"></span>
                                { address }
                            </p>
                            <p className="info phone">
                                <span className="icon icon-phone"></span>
                                <span className="content">
                                    <span className="label label-red">{this.state.business.phoneNumber ? this.state.business.phoneNumber : 'Information not available'  }</span>
                                </span>
                            </p>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-12 map">
                            {mapElement}
                        </div>
                    </div>
                </PublicLayout>
            );
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
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

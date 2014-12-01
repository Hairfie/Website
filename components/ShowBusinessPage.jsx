/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var BusinessStore = require('../stores/BusinessStore');
var PublicLayout = require('./PublicLayout.jsx');

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
                    <p>
                        {business.address.street} <br />
                        {business.address.zipCode} {business.address.city}
                    </p>
                )
            } else {
                address = (
                    <p>
                        Information not available
                    </p>
                )
            }

            var mapElement;
            if (address.gps) {
                mapElement = <div id="gmap-business" data-lat={business.gps.lat} data-lng={business.gps.lng} data-title={business.name } />
            }

            return (
                <PublicLayout context={this.props.context}>
                    <div className="row" id="business-header">
                        <div className="col-md-3 col-md-offset-1 col-sm-3 col-sm-offset-1 col-xs-12 pictures">
                            <img src={business.thumbUrl + '?height=300&width=230'} className="img-rounded"/>
                        </div>
                        <div className="col-md-4 col-sm-3 col-xs-12 infos">
                            <h1>{business.name}</h1>
                            <p className="info address">
                                <span className="icon icon-address"></span>
                                <span className="content">
                                    { address }
                                </span>
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

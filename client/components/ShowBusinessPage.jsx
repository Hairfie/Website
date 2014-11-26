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
        if(!this.state.business) {
            return (
                <div>Loading Business in progress</div>
            );
        } else {
            var address;
            if (this.state.business.address) {
                address = (
                    <p>
                        { this.state.business.address.street  } <br />
                        { this.state.business.address.zipCode  } { this.state.business.address.city }
                    </p>
                )
            } else {
                address = (
                    <p>
                        Information not available
                    </p>
                )
            }

            return (
                <PublicLayout context={this.props.context}>
                    <div className="row" id="business-header">
                        <div className="col-md-3 col-md-offset-1 col-sm-3 col-sm-offset-1 col-xs-12 pictures">
                            <img src={ this.state.business.pictures[0].url + '?height=300&width=230' } className="img-rounded"/>
                        </div>
                        <div className="col-md-4 col-sm-3 col-xs-12 infos">
                            <h1> {this.state.business.name  }</h1>
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
                            <div id="gmap-business" data-lat={ this.state.business.gps.lat } data-lng={ this.state.business.gps.lng } data-title="{ this.state.business.name }"></div>
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

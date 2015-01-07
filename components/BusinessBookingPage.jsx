/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var BusinessStore = require('../stores/BusinessStore');
var BookingStore  = require('../stores/BookingStore');
var PublicLayout  = require('./PublicLayout.jsx');


module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, BookingStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getBusiness(),
            booking: this.getStore(BookingStore).getBooking(),
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business;
            return (
                <PublicLayout context={this.props.context}>
                    <h1>Réserver chez {business.name}</h1>
                    <h4>Work in progress</h4>
                </PublicLayout>
            );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
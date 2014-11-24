/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var getBusinessAction = require('../actions/getBusiness');
var BusinessStore = require('../stores/BusinessStore');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            hairfie: this.getStore(BusinessStore).getBusiness(),
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <div className="business">
                { this.state.business.name }
            </div>
        );
    }
});
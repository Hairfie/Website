/** @jsx React.DOM */

'use strict';

var React = require('react');

var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var BusinessKinds = require('../constants/BusinessConstants').Kinds;

var Layout = require('./ProLayout.jsx');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getBusiness(),
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business || {},
            address  = business.address || {};

        return (
            <Layout context={this.props.context} business={this.state.business}>
                <h2>Clients</h2>

            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

/** @jsx React.DOM */

'use strict';

var React = require('react');

var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');

var Layout = require('./ProLayout.jsx');
var GeneralForm = require('./Business/GeneralForm.jsx');
var MapForm = require('./Business/MapForm.jsx');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            step: this.getStore(require('../stores/ApplicationStore')).getRouteParam('step'),
            business: this.getStore(BusinessStore).getBusiness(),
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var form;
        switch (this.state.step) {
            case 'general':
                form = <GeneralForm key={this.state.business.id} business={this.state.business} />
                break;

            case 'map':
                form = <MapForm key={this.state.business.id} business={this.state.business} />
                break;
        }

        return (
            <Layout context={this.props.context}>
                {form}
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

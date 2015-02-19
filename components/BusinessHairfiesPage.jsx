/** @jsx React.DOM */

'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var BusinessKinds = require('../constants/BusinessConstants').Kinds;

var Layout = require('./ProLayout.jsx');
var ShowHairfies = require('./ShowHairfies.jsx');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getById(this.props.route.params.businessId),
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
                <h2>Hairfies du salon</h2>
                <div className="row business-hairfies">
                    <ShowHairfies businessId={business.id} withDeleteButton={true} context={this.props.context} />
                </div>
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

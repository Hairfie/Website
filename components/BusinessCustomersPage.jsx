/** @jsx React.DOM */

'use strict';

var React = require('react');

var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessCustomersStore = require('../stores/BusinessCustomersStore');
var BusinessActions = require('../actions/Business');
var BusinessKinds = require('../constants/BusinessConstants').Kinds;

var Layout = require('./ProLayout.jsx');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessCustomersStore]
    },
    getStateFromStores: function () {
        var business = this.getStore(BusinessStore).getBusiness();

        return {
            business        : business,
            businessMembers : this.getStore(BusinessCustomersStore).getCustomersByBusiness(business)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business || {};
        var businessMembers = this.state.customers || [];
        var businessMemberRows = customers.map(this.renderCustomerRow);

        return (
            <Layout context={this.props.context} business={this.state.business}>
                <h2>Clients</h2>
                { businessMemberRows }
            </Layout>
        );
    },
    renderCustomerRow: function (customer) {
        return (
            <tr key={customer.email}>
                <td>{customer.email}</td>
            </tr>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

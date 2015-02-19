/** @jsx React.DOM */

'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessCustomersStore = require('../stores/BusinessCustomersStore');
var BusinessActions = require('../actions/Business');
var BusinessKinds = require('../constants/BusinessConstants').Kinds;

var Layout = require('./ProLayout.jsx');

var _ = require('lodash');

if (typeof global.Intl == 'undefined') {
    global.Intl = require('intl');
}

var ReactIntlMixin = require('react-intl');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [FluxibleMixin, ReactIntlMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessCustomersStore]
    },
    getStateFromStores: function () {
        return {
            business    : this.getStore(BusinessStore).getById(this.props.route.params.businessId),
            customers   : this.getStore(BusinessCustomersStore).getByBusiness(this.props.route.params.businessId)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business || {};
        var customers = this.state.customers || [];
        var customersRow = customers.map(this.renderCustomerRow);

        return (
            <Layout context={this.props.context} business={this.state.business}>
                <h2>Clients</h2>
                <div className="alert alert-success">
                    <strong>Attention, pour remplir cette page</strong> pensez à prendre systématiquement les emails de vos clients au moment de poster un hairfie !
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <td>Email</td>
                            <td>Nombre de hairfies</td>
                            <td>Date</td>
                            <td>Prix</td>
                            <td>Hairfie</td>
                        </tr>
                    </thead>
                    { customersRow }
                </table>
            </Layout>
        );
    },
    renderCustomerRow: function (customer) {
        var hairfieNodes = _.map(customer.hairfies, function(hairfie, index) {
            return this.renderHairfieRow(customer, hairfie, index);
        }, this);
        return (
            <tbody>
                { hairfieNodes }
            </tbody>
        );

    },
    renderHairfieRow: function(customer, hairfie, index) {
        var tdHairfie = (
            <td><a href={hairfie.landingPageUrl} target="_blank"><img src={hairfie.picture.url + "?width=100"} alt={hairfie.description} /></a></td>
        );
        var date = (<td>{ this.formatDate(hairfie.createdAt) } </td>);
        var price = hairfie.price ? (<td>{ hairfie.price.amount } €</td>) : (<td> </td>);
        if(index === 0) {
            return (
                <tr key={hairfie.id}>
                    <td rowSpan={customer.numHairfies}>{customer.email}</td>
                    <td rowSpan={customer.numHairfies}>{customer.numHairfies}</td>
                    { date }
                    { price }
                    { tdHairfie }
                </tr>
            );
        } else {
            return (
                <tr key={hairfie.id}>
                    { date }
                    { price }
                    { tdHairfie }
                </tr>
            );
        }
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

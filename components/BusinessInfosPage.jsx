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
                <Input ref="name" type="text" label="Nom de la société" defaultValue={business.name} />
                <Input ref="kind" type="select" label="Activité" defaultValue={business.kind}>
                    <option value={BusinessKinds.SALON}>Salon de coiffure</option>
                    <option value={BusinessKinds.HOME}>Coiffure à domicile</option>
                </Input>
                <Input ref="phoneNumber" type="text" label="Numéro de téléphone" defaultValue={business.phoneNumber} />
                <Input ref="addressStreet" type="text" label="Numéro et nom de voie" defaultValue={address.street} />
                <Input ref="addressCity" type="text" label="Ville / Commune" defaultValue={address.city} />
                <Input ref="addressZipCode" type="text" label="Code postal" defaultValue={address.zipCode} />

                <Button onClick={this.save}>Sauver les modifications</Button>
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    save: function () {
        var business = {};
        business.id = this.state.business.id;
        business.name = this.refs.name.getValue();
        business.kind = this.refs.kind.getValue();
        business.phoneNumber = this.refs.phoneNumber.getValue();
        business.address = {};
        business.address.street = this.refs.addressStreet.getValue();
        business.address.city = this.refs.addressCity.getValue();
        business.address.zipCode = this.refs.addressZipCode.getValue();
        business.address.country = (this.state.business && this.state.business.address && this.state.business.address.country) || 'FR';

        this.props.context.executeAction(BusinessActions.Save, {
            business: business
        });
    }
});

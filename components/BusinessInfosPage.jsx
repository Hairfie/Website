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
var LocationPicker = require('./Form/LocationPicker.jsx');

var AddressInputGroup = React.createClass({
    render: function () {
        var address = this.props.defaultAddress || {};

        return (
            <div>
                <Input ref="street" type="text" label="Numéro et nom de voie" defaultValue={address.street} onChange={this.handleChange} />
                <Input ref="city" type="text" label="Ville / Commune" defaultValue={address.city} onChange={this.handleChange} />
                <Input ref="zipCode" type="text" label="Code postal" defaultValue={address.zipCode} onChange={this.handleChange} />
            </div>
        );
    },
    getAddress: function () {
        return {
            street  : this.refs.street.getValue(),
            city    : this.refs.city.getValue(),
            zipCode : this.refs.zipCode.getValue(),
            country : 'FR' // TODO: add country field
        };
    },
    handleChange: function () {
        this.props.onChange();
    }
});

var AddressWithMap = React.createClass({
    getInitialState: function () {
        return {
            address : this.props.defaultAddress,
            gps     : this.props.defaultGps,
        }
    },
    render: function () {
        return (
            <div>
                <AddressInputGroup ref="address" defaultAddress={this.state.address} onChange={this.handleAddressChange} />
                <Input label="Carte">
                    <LocationPicker ref="gps" defaultLocation={this.state.gps} onChange={this.handleLocationChange} width={600} height={400} />
                </Input>
            </div>
        );
    },
    getAddress: function () {
        return this.state.address;
    },
    getGps: function () {
        return this.state.gps;
    },
    handleAddressChange: function () {
        this.setState({address: this.refs.address.getAddress()});
    },
    handleLocationChange: function () {
        this.setState({gps: this.refs.gps.getLocation()});
    }
});

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

                <AddressWithMap ref="address" defaultAddress={business.address} defaultGps={business.gps} />

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
        business.address = this.refs.address.getAddress();
        business.gps = this.refs.address.getGps();

        this.props.context.executeAction(BusinessActions.Save, {
            business: business
        });
    },
    handleAddressChange: function () {
        console.log('new address', this.refs.address.getAddress());
    }
});

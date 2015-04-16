'use strict';

var React = require('react');

var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
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

var DescriptionInputGroup = React.createClass({
    render: function () {
        var description = this.props.defaultDescription || {};

        return (
            <div>
                <Input ref="geoTitle" type="text" label="Titre ayant référence à la localisation" defaultValue={description.geoTitle} onChange={this.handleChange} />
                <Input ref="geoText" type="textarea" label="Texte sur la localisation" defaultValue={description.geoText} onChange={this.handleChange} />
                <Input ref="proTitle" type="text" label="Titre donnant une spécialité/spécificité du coiffeur" defaultValue={description.proTitle} onChange={this.handleChange} />
                <Input ref="proText" type="textarea" label="Text sur le/les coiffeurs et leurs spécialités" defaultValue={description.proText} onChange={this.handleChange} />
                <Input ref="businessTitle" type="text" label="Titre référence au salon" defaultValue={description.businessTitle} onChange={this.handleChange} />
                <Input ref="businessText" type="textarea" label="Texte sur les salons" defaultValue={description.businessText} onChange={this.handleChange} />
            </div>
        );
    },
    getDescription: function () {
        return {
            geoTitle  : this.refs.geoTitle.getValue(),
            geoText    : this.refs.geoText.getValue(),
            proTitle : this.refs.proTitle.getValue(),
            proText : this.refs.proText.getValue(),
            businessTitle : this.refs.businessTitle.getValue(),
            businessText : this.refs.businessText.getValue()
        };
    },
    handleChange: function () {
        //this.props.onChange();
    }
});

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
                <Input ref="name" type="text" label="Nom de la société" defaultValue={business.name} />
                <Input ref="men" type="checkbox" label="Pour hommes" defaultChecked={business.men} />
                <Input ref="women" type="checkbox" label="Pour femmes" defaultChecked={business.women} />
                <Input ref="children" type="checkbox" label="Pour enfants" defaultChecked={business.children} />
                <Input ref="kind" type="select" label="Activité" defaultValue={business.kind}>
                    <option value={BusinessKinds.SALON}>Salon de coiffure</option>
                    <option value={BusinessKinds.HOME}>Coiffure à domicile</option>
                </Input>
                <Input ref="phoneNumber" type="text" label="Numéro de téléphone" defaultValue={business.phoneNumber} />

                <DescriptionInputGroup ref="description" defaultDescription={business.description} />

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
        business.men = this.refs.men.getChecked();
        business.women = this.refs.women.getChecked();
        business.children = this.refs.children.getChecked();
        business.kind = this.refs.kind.getValue();
        business.phoneNumber = this.refs.phoneNumber.getValue();
        business.address = this.refs.address.getAddress();
        business.gps = this.refs.address.getGps();
        business.description = this.refs.description.getDescription();

        this.executeAction(BusinessActions.Save, {
            business: business
        });
    }
});

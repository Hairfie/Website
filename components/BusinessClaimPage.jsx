/** @jsx React.DOM */

'use strict';

var React = require('react');

var BusinessActions = require('../actions/Business');
var BusinessKinds = require('../constants/BusinessConstants').Kinds;
var Layout = require('./ProLayout.jsx');
var Input = require('react-bootstrap/Input');
var AddressInput = require('./Form/AddressInput.jsx');
var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    render: function () {
        return (
            <Layout>
                <Input ref="name" type="text" label="Nom de votre société" />
                <Input ref="kind" label="Activité" type="select">
                    <option value={BusinessKinds.SALON}>Salon de coiffure</option>
                    <option value={BusinessKinds.HOME}>Coiffure à domicile</option>
                </Input>
                <AddressInput ref="address" label="Adresse" />
                <Input ref="phoneNumber" type="text" label="Numéro de téléphone" />

                <Button onClick={this.save}>Valider</Button>
            </Layout>
        );
    },
    save: function () {
        var business = {
            name        : this.refs.name.getValue(),
            kind        : this.refs.kind.getDOMNode().value,
            address     : this.refs.address.getAddress(),
            gps         : this.refs.address.getGps(),
            phoneNumber : this.refs.phoneNumber.getValue()
        };

        this.executeAction(BusinessActions.Claim, {
            business: business
        });
    }
});

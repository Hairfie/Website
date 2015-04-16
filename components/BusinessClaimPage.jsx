'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var BusinessActions = require('../actions/Business');
var BusinessKinds = require('../constants/BusinessConstants').Kinds;
var Layout = require('./ProLayout.jsx');
var Input = require('react-bootstrap/Input');
var AddressInput = require('./Form/AddressInput.jsx');
var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    render: function () {
        return (
            <Layout context={this.props.context}>
                <Input ref="name" type="text" label="Nom de votre société" />
                <Input ref="kind" label="Activité" type="select">
                    <option value={BusinessKinds.SALON}>Salon de coiffure</option>
                    <option value={BusinessKinds.HOME}>Coiffure à domicile</option>
                </Input>
                <div className="form-group" >
                    <AddressInput ref="address" label="Adresse" className="form-control" />
                </div>
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

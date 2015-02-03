/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible').StoreMixin;
var ServiceStore = require('../stores/ServiceStore');
var BusinessStore = require('../stores/BusinessStore');
var BusinessServiceStore = require('../stores/BusinessServiceStore');
var BusinessServiceActions = require('../actions/BusinessService');
var Layout = require('./ProLayout.jsx');
var Table = require('react-bootstrap/Table');
var Button = require('react-bootstrap/Button');
var Modal = require('react-bootstrap/Modal');
var ModalTrigger = require('react-bootstrap/ModalTrigger');
var Input = require('react-bootstrap/Input');
var Uuid = require('uuid');

var BusinessServiceModal = React.createClass({
    render: function () {
        var bs = this.props.businessService || {};

        return (
            <Modal {...this.props}>
                <div className="modal-body">
                    <Input ref="label" label="Service" placeholder="Shampoing Coupe Brushing" type="string" defaultValue={bs.label ? bs.label : 'Shampoing Coupe Brushing'} />
                    <Input ref="priceAmount" label="Prix (en €)" type="text" defaultValue={bs.price ? bs.price.amount : null} />
                    <Input ref="durationMinutes" label="Durée (en minutes)" type="number" defaultValue={bs.durationMinutes ? bs.durationMinutes : 60} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.handleSave}>Sauver</Button>
                </div>
            </Modal>
        );
    },
    renderServiceOptions: function () {
        return this.props.services.map(function (service) {
            return <option key={service.id} value={service.id}>{service.label}</option>;
        });
    },
    handleSave: function () {
        var bs = this.props.businessService || {};
        this.props.onSave({
            id              : bs.id,
            label           : this.refs.label.getValue(),
            price           : {
                currency    : 'EUR',
                amount      : this.refs.priceAmount.getValue() ? this.refs.priceAmount.getValue() : null,
            },
            durationMinutes : this.refs.durationMinutes.getValue()
        });
        this.props.onRequestHide();
    }
});

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [ServiceStore, BusinessStore, BusinessServiceStore]
    },
    getStateFromStores: function () {
        return {
            services        : this.getStore(ServiceStore).getServices(),
            business        : this.getStore(BusinessStore).getById(this.props.route.params.businessId),
            businessServices: this.getStore(BusinessServiceStore).getByBusiness(this.props.route.params.businessId)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var loading = !this.state.businessServices;
        var businessServiceRows = (this.state.businessServices || []).map(this.renderBusinessServiceRow);

        return (
            <Layout context={this.props.context} business={this.state.business} loading={loading}>
                <Table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Prix</th>
                            <th>Durée</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {businessServiceRows}
                    </tbody>
                </Table>

                <ModalTrigger modal={<BusinessServiceModal services={this.state.services} onSave={this.saveBusinessService} />}>
                    <Button>Ajouter un service</Button>
                </ModalTrigger>
            </Layout>
        );
    },
    renderBusinessServiceRow: function (businessService) {
        return (
            <tr key={businessService.id}>
                <td>
                    {businessService.label}
                </td>
                <td>
                    {businessService.price}
                </td>
                <td>
                    {businessService.durationMinutes}
                </td>
                <td>
                    <ModalTrigger modal={<BusinessServiceModal businessService={businessService} services={this.state.services} onSave={this.saveBusinessService} />}>
                        <Button bsSize="xsmall">Modifier</Button>
                    </ModalTrigger>
                    <Button bsSize="xsmall" onClick={this.deleteBusinessService.bind(this, businessService)}>Supprimer</Button>
                </td>
            </tr>
        );
    },
    saveBusinessService: function (businessService) {
        businessService.business = this.state.business;
        this.props.context.executeAction(BusinessServiceActions.Save, {
            businessService: businessService
        });
    },
    deleteBusinessService: function (businessService) {
        this.props.context.executeAction(BusinessServiceActions.Delete, {
            businessService: businessService
        });
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

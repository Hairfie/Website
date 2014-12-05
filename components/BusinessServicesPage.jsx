/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
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
                    <Input ref="serviceId" label="Service" type="select" defaultValue={bs.serviceId}>
                        {this.renderServiceOptions()}
                    </Input>
                    <Input ref="priceAmount" label="Price (in €)" type="text" defaultValue={bs.price ? bs.price.amount : null} />
                    <Input ref="durationMinutes" label="Duration (in minutes)" type="number" defaultValue={bs.durationMinutes} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.handleSave}>Save</Button>
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
            id              :  bs.id,
            serviceId       : this.refs.serviceId.getValue(),
            price           : {
                currency    : 'EUR',
                amount      : this.refs.priceAmount.getValue(),
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
        var business = this.getStore(BusinessStore).getBusiness();
        var businessServices = this.getStore(BusinessServiceStore).getBusinessServicesByBusiness(business);

        return {
            services        : this.getStore(ServiceStore).getServices(),
            business        : business,
            businessServices: businessServices || []
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var businessServiceRows = this.state.businessServices.map(this.renderBusinessServiceRow);

        return (
            <Layout context={this.props.context} business={this.state.business}>
                <Table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Price</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {businessServiceRows}
                    </tbody>
                </Table>

                <ModalTrigger modal={<BusinessServiceModal services={this.state.services} onSave={this.saveBusinessService} />}>
                    <Button>Add a service</Button>
                </ModalTrigger>
            </Layout>
        );
    },
    renderBusinessServiceRow: function (businessService) {
        return (
            <tr key={businessService.id}>
                <td>
                    {businessService.service.label}
                </td>
                <td>
                    {businessService.price}
                </td>
                <td>
                    {businessService.durationMinutes}
                </td>
                <td>
                    <ModalTrigger modal={<BusinessServiceModal businessService={businessService} services={this.state.services} onSave={this.saveBusinessService} />}>
                        <Button>Edit</Button>
                    </ModalTrigger>
                    <Button onClick={this.deleteBusinessService.bind(this, businessService)}>Delete</Button>
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

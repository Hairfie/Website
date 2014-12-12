/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessMemberStore = require('../stores/BusinessMemberStore');
var BusinessMemberActions = require('../actions/BusinessMember');
var Layout = require('./ProLayout.jsx');
var Table = require('react-bootstrap/Table');
var Modal = require('react-bootstrap/Modal');
var ModalTrigger = require('react-bootstrap/ModalTrigger');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var UserPicker = require('./Form/UserPicker.jsx');
var _ = require('lodash');

var BusinessMemberModal = React.createClass({
    getInitialState: function () {
        return {
            selectedUser: null
        };
    },
    render: function () {
        var user    = this.state.selectedUser || {},
            hasUser = !!this.state.selectedUser;

        return (
            <Modal {...this.props}>
                <div className="modal-body">
                    <UserPicker ref="user" context={this.props.context} onUserChange={this.handleUserChange} label="Utilisateur" />
                    <Input ref="firstName" label="Prénom" type="text" value={user.firstName} readOnly={hasUser} />
                    <Input ref="lastName" label="Nom" type="text" value={user.lastName} readOnly={hasUser} />
                    <Input ref="hidden" label="Cacher ce membre" type="checkbox" />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.save}>Ajouter à l'équipe</Button>
                </div>
            </Modal>
        );
    },
    handleUserChange: function (user) {
        this.setState({selectedUser: user});
    },
    save: function () {
        this.props.onSave({
            user: this.refs.user.getUser(),
            firstName: this.refs.firstName.getValue(),
            lastName: this.refs.lastName.getValue(),
            hidden: this.refs.hidden.getChecked(),
            active: true
        });
        this.props.onRequestHide();
    }
});

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessMemberStore]
    },
    getStateFromStores: function () {
        var business = this.getStore(BusinessStore).getBusiness();

        return {
            business        : business,
            businessMembers : this.getStore(BusinessMemberStore).getBusinessMembersByBusiness(business)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var businessMembers = this.state.businessMembers || [];
        var businessMemberRows = businessMembers.map(this.renderBusinessMemberRow);

        return (
            <Layout context={this.props.context} business={this.state.business}>
                <h2>Membres de l'équipe</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Caché ?</th>
                            <th>Actif ?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {businessMemberRows}
                    </tbody>
                </Table>

                <ModalTrigger modal={<BusinessMemberModal context={this.props.context} onSave={this.saveBusinessMember} />}>
                    <Button>Ajouter un membre à l'équipe</Button>
                </ModalTrigger>
            </Layout>
        );
    },
    renderBusinessMemberRow: function (businessMember) {
        return (
            <tr key={businessMember.id}>
                <td>{businessMember.firstName} {businessMember.lastName}</td>
                <td>{businessMember.hidden ? 'oui' : 'non'}</td>
                <td>{businessMember.active ? 'oui' : 'non'}</td>
            </tr>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    saveBusinessMember: function (businessMember) {
        businessMember.business = this.state.business;

        this.props.context.executeAction(BusinessMemberActions.Save, {
            businessMember: businessMember
        });
    },
    updateBusinessMemberWithValues: function (businessMember, values) {
        this.saveBusinessMember(_.merge({}, values, {id: businessMember.id}));
    }
});

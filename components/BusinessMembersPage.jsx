/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessMemberStore = require('../stores/BusinessMemberStore');
var BusinessMemberActions = require('../actions/BusinessMember');
var Layout = require('./ProLayout.jsx');
var Table = require('react-bootstrap/Table');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var Modal = require('react-bootstrap/Modal');
var ModalTrigger = require('react-bootstrap/ModalTrigger');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Glyphicon = require('react-bootstrap/Glyphicon');
var Picture = require('./Partial/Picture.jsx');
var UserPicker = require('./Form/UserPicker.jsx');
var PictureInput = require('./Form/PictureInput.jsx');
var _ = require('lodash');

var BusinessMemberModal = React.createClass({
    getInitialState: function () {
        return {
            selectedUser: this.props.businessMember && this.props.businessMember.user
        };
    },
    render: function () {
        var user           = this.state.selectedUser || {},
            hasUser        = !!this.state.selectedUser,
            businessMember = this.props.businessMember || {};

        return (
            <Modal {...this.props}>
                <div className="modal-body">
                    <UserPicker ref="user" defaultUser={this.state.selectedUser} context={this.props.context} onUserChange={this.handleUserChange} label="Utilisateur" />
                    <PictureInput context={this.props.context} container="business-pictures" ref="picture" label="Photo" defaultPicture={businessMember.picture} />
                    <Row>
                        <Col xs={4}>
                            <Input ref="gender" label="Genre" type="select" defaultValue={businessMember.gender} value={user.gender} readOnly={hasUser}>
                                <option value="MALE">Homme</option>
                                <option value="FEMALE">Femme</option>
                            </Input>
                        </Col>
                        <Col xs={4}>
                            <Input ref="firstName" label="Prénom" type="text" defaultValue={businessMember.firstName} value={user.firstName} readOnly={hasUser} />
                        </Col>
                        <Col xs={4}>
                            <Input ref="lastName" label="Nom" type="text" defaultValue={businessMember.lastName} value={user.lastName} readOnly={hasUser} />
                        </Col>
                    </Row>
                    <Input ref="email" label="Email" type="text" defaultValue={businessMember.email} />
                    <Input ref="phoneNumber" label="Téléphone" type="text" defaultValue={businessMember.phoneNumber} />
                    <Input ref="hidden" label="Cacher ce membre" type="checkbox" defaultChecked={businessMember.hidden} />
                </div>
                <div className="modal-footer">
                    <Button onClick={this.save}>{this.props.businessMember ? 'Sauver les modifications' : 'Ajouter à l\'équipe'}</Button>
                </div>
            </Modal>
        );
    },
    handleUserChange: function (user) {
        this.setState({selectedUser: user});
    },
    save: function () {
        this.props.onSave({
            id          : this.props.businessMember && this.props.businessMember.id,
            user        : this.refs.user.getUser(),
            gender      : this.refs.gender.getValue(),
            picture     : this.refs.picture.getPicture(),
            firstName   : this.refs.firstName.getValue(),
            lastName    : this.refs.lastName.getValue(),
            email       : this.refs.email.getValue(),
            phoneNumber : this.refs.phoneNumber.getValue(),
            hidden      : this.refs.hidden.getChecked(),
            active      : true
        });
        this.props.onRequestHide();
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessMemberStore]
    },
    getStateFromStores: function () {
        return {
            business        : this.getStore(BusinessStore).getById(this.props.route.params.businessId),
            businessMembers : this.getStore(BusinessMemberStore).getActiveByBusiness(this.props.route.params.businessId)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var loading = !this.state.businessMembers;
        var businessMembers = this.state.businessMembers || [];
        var businessMemberRows = businessMembers.map(this.renderBusinessMemberRow);

        return (
            <Layout context={this.props.context} business={this.state.business} loading={loading}>
                <h2>Membres de l'équipe</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Photo</th>
                            <th>Nom</th>
                            <th>Caché ?</th>
                            <th>Actions</th>
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
        var picture;
        if (businessMember.picture) {
            picture = <Picture picture={businessMember.picture} resolution={{width: 50, height: 50}} />;
        }

        return (
            <tr key={businessMember.id}>
                <td style={{width: '50px'}}>{picture}</td>
                <td>{businessMember.firstName} {businessMember.lastName}</td>
                <td>{businessMember.hidden ? 'oui' : 'non'}</td>
                <td>
                    <ModalTrigger modal={<BusinessMemberModal context={this.props.context} businessMember={businessMember} onSave={this.saveBusinessMember} />}>
                        <Button bsSize="xsmall">Modifier</Button>
                    </ModalTrigger>
                    <Button bsSize="xsmall" onClick={this.delete.bind(this, businessMember)}><Glyphicon glyph="remove" /> Supprimer</Button>
                </td>
            </tr>
        );
    },
    delete: function (businessMember) {
        if (!confirm('Voulez-vous vraiment supprimer ce membre ?')) return;

        this.executeAction(BusinessMemberActions.Save, {
            businessMember: {
                id      : businessMember.id,
                active  : false
            }
        });
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    saveBusinessMember: function (businessMember) {
        businessMember.business = this.state.business;

        this.executeAction(BusinessMemberActions.Save, {
            businessMember: businessMember
        });
    }
});

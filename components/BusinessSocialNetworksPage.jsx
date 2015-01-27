/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var BusinessFacebookPageStore = require('../stores/BusinessFacebookPageStore');
var FacebookStore = require('../stores/FacebookStore');
var FacebookActions = require('../actions/Facebook');
var FacebookPermissions = require('../constants/FacebookConstants').Permissions;
var Layout = require('./ProLayout.jsx');
var Panel = require('react-bootstrap/Panel');
var Label = require('react-bootstrap/Label');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Modal = require('react-bootstrap/Modal');
var ModalTrigger = require('react-bootstrap/ModalTrigger');
var _ = require('lodash');

var ConnectFacebookPageModal = React.createClass({
    facebookPermissions: [
        FacebookPermissions.MANAGE_PAGES,
        FacebookPermissions.PUBLISH_ACTIONS
    ],
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, FacebookStore]
    },
    getStateFromStores: function () {
        return {
            business        : this.getStore(BusinessStore).getBusiness(),
            hasPermissions  : this.getStore(FacebookStore).hasPermissions(this.facebookPermissions),
            managedPages    : this.getStore(FacebookStore).getPagesWithCreateContentPermission()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <Modal {...this.props} title="Connecter une page facebook">
                <div className="modal-body">
                    {this.renderBody()}
                </div>
            </Modal>
        );
    },
    renderBody: function () {
        if (!this.state.hasPermissions) return this.renderBodyLogin();
        if (!this.state.managedPages.length) return this.renderBodyNoManagedPage();

        var managedPageOptions = this.state.managedPages.map(function (page) {
            return <option key={page.id} value={page.id}>{page.name}</option>;
        });

        return (
            <div>
                <p>Sélectionnez dans la liste ci-dessous la page facebook que vous souhaitez connecter à votre activité Hairfie.</p>
                <Input ref="page" type="select">
                    {managedPageOptions}
                </Input>
                <Button onClick={this.connectPage}>Connecter la page</Button>
            </div>
        );
    },
    renderBodyLogin: function () {
        return (
            <div>
                <p>Pour pouvoir associer une page facebook, vous devez autoriser Hairfie à gérer vos pages.</p>
                <Button className="btn-social btn-facebook" onClick={this.linkFacebook}>
                    <i className="fa fa-facebook" />
                    Autoriser Hairfie à gérer mes pages Facebook
                </Button>
            </div>
        );
    },
    renderBodyNoManagedPage: function () {
        return <p>Aucune page n'a pu être trouvée.</p>;
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    linkFacebook: function () {
        this.props.context.executeAction(FacebookActions.Link, {
            scope: this.facebookPermissions
        });
    },
    connectPage: function () {
        var facebookPage = _.find(this.state.managedPages, {id: this.refs.page.getValue()});
        if (facebookPage) {
            this.props.context.executeAction(BusinessActions.SaveFacebookPage, {
                business    : this.state.business,
                facebookPage: facebookPage
            });

            this.props.onRequestHide();
        }
    }
});

var FacebookPanel = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessFacebookPageStore]
    },
    getStateFromStores: function () {
        var business = this.getStore(BusinessStore).getBusiness(),
            page     = null;

        if (business) {
            page = this.getStore(BusinessFacebookPageStore).getFacebookPageByBusiness(business);
        }

        return {
            business: business,
            page    : page
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <Panel {...this.props} header={this.renderHeader()}>
                {this.renderBody()}
            </Panel>
        );
    },
    renderHeader: function () {
        var status;
        if (this.state.page) {
            status = <Label bsStyle="success">Connecté</Label>;
        } else {
            status = <Label bsStyle="danger">Non connecté</Label>;
        }

        return (
            <div>
                <i className="fa fa-facebook" /> Facebook
                <span className="pull-right">{status}</span>
            </div>
        );
    },
    renderBody: function () {
        if (this.state.page) return this.renderBodyWithPage();
        else return this.renderBodyWithoutPage();
    },
    renderBodyWithPage: function () {
        return (
            <div>
                <p>Connecté à la page "{this.state.page.name}".</p>
                <Button onClick={this.disconnectPage}>Déconnecter la page</Button>
            </div>
        );
    },
    renderBodyWithoutPage: function () {
        return (
            <ModalTrigger modal={<ConnectFacebookPageModal context={this.props.context} />}>
                <Button>Connecter une page facebook</Button>
            </ModalTrigger>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    disconnectPage: function () {
        this.props.context.executeAction(BusinessActions.DeleteFacebookPage, {
            business: this.state.business
        });
    }
});

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessFacebookPageStore]
    },
    getStateFromStores: function () {
        var business = this.getStore(BusinessStore).getBusiness();

        return {
            business: business
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <Layout context={this.props.context} business={this.state.business}>
                <h2>Réseaux Sociaux</h2>
                <FacebookPanel context={this.props.context} />
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

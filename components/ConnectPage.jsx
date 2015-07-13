'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var PublicLayout = require('./PublicLayout.jsx');
var FacebookButton = require('./Auth/FacebookButton.jsx');
var FormConnect = require('./Auth/FormConnect.jsx');
var Link = require('./Link.jsx');

var ConnectPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func,
        getFacebookSdk: React.PropTypes.func
    },
    render: function() {
        if (this.props.token.id)
            return this.renderAlreadyConnected();
        return (
            <PublicLayout>
                <div className="connect-form col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
                    <h2>Connexion</h2>
                    <Link route="registration_page" className="green">Pas encore inscrit ? Inscrivez-vous</Link>
                    <FacebookButton withNavigate={true} />
                    <h4>ou par adresse email</h4>
                    <span className="separator"/>
                    <FormConnect withNavigate={true} />
                </div>
            </PublicLayout>
            );
    },
    renderAlreadyConnected: function() {
        return (
            <PublicLayout>
                <h2>Il semble que vous soyez déjà connecté</h2>
            </PublicLayout>
            );
    }
});

ConnectPage = connectToStores(ConnectPage, [
    'AuthStore'
], function (stores, props) {
    return {
        token: stores.AuthStore.getToken()
    };
});

module.exports = ConnectPage;
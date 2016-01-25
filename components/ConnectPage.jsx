'use strict';

var React = require('react');
var _ = require('lodash');
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
        return (
            <PublicLayout>
                <div className="connect-form col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
                    <div className="nav">
                        <Link route="connect_page" className="col-xs-6">
                            <p>Vous êtes déjà inscrit ?</p>
                            <p className="link-style">Connectez-vous</p>
                        </Link>
                        <Link route="registration_page" className="col-xs-6">
                            <p>Pas encore inscrit ?</p>
                            <p className="link-style">Inscrivez-vous</p>
                        </Link>
                    </div>
                    <h2>Connexion via Facebook</h2>
                    <FacebookButton withNavigate={true} />
                    <h4>ou par mail</h4>
                    <FormConnect withNavigate={true} />
                </div>
            </PublicLayout>
            );
    }
});

module.exports = ConnectPage;
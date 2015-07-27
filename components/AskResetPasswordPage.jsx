'use strict';

var React = require('react');
var _ = require('lodash');
var PublicLayout = require('./PublicLayout.jsx');
var FormResetPassword = require('./Auth/FormResetPassword.jsx');

var ConnectPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function() {
        return (
            <PublicLayout>
                <div className="connect-form col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
                    <h2>Mot de passe oublié</h2>
                    <FormResetPassword email={this.props.route.query.email || ""} />
                </div>
            </PublicLayout>
            );
    }
});

module.exports = ConnectPage;
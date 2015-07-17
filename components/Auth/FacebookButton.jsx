'use strict';

var React = require('react');
var _ = require('lodash');
var AuthActions = require('../../actions/AuthActions');

module.exports = React.createClass({
	contextTypes: {
		executeAction: React.PropTypes.func,
        getFacebookSdk: React.PropTypes.func
    },
	render: function() {
		return (
			<div className="connect-button" {...this.props}>
	            <div className="facebook" role="button" onClick={this.facebookConnect}><span>Se connecter avec Facebook</span></div>
	        </div>
	    );
	},
    facebookConnect: function() {
        this.context.getFacebookSdk()
            .then(function(sdk) {
                sdk.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        this.context.executeAction(AuthActions.facebookConnect, {access_token: response.authResponse.accessToken, withNavigate: this.props.withNavigate});
                    }
                    else {
                        sdk.login(function (response) {
                        	if (response.authResponse)
                        		this.context.executeAction(AuthActions.facebookConnect, {access_token: response.authResponse.accessToken, withNavigate: this.props.withNavigate});
                        }, {scope: 'email'});
                    }
                }.bind(this)
        	);
        }.bind(this))
    }
});
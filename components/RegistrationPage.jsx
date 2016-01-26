'use strict';

var React = require('react');
var _ = require('lodash');
var PublicLayout = require('./PublicLayout.jsx');
var FacebookButton = require('./Auth/FacebookButton.jsx');
var FormRegistration = require('./Auth/FormRegistration.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Link = require('./Link.jsx');

var RegistrationPage = React.createClass({
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
					<h2>Inscription</h2>
					<FacebookButton withNavigate={true}/>
					<h4>ou remplissez ce formulaire</h4>
					<FormRegistration
						withNavigate={true}
						firstName={this.props.booking.firstName || ""}
						lastName={this.props.booking.lastName || ""}
						phoneNumber={this.props.booking.phoneNumber || ""}
						email={this.props.booking.email || ""}
						gender={this.props.booking.gender || ""} />
				</div>
			</PublicLayout>
			);
	}
});

RegistrationPage = connectToStores(RegistrationPage, [
    'BookingStore'
], function (context, props) {
    return {
        booking: props.route.query.bookingId ? context.getStore('BookingStore').getById(props.route.query.bookingId) : {}
    };
});

module.exports = RegistrationPage;
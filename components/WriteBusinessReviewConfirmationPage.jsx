'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Layout = require('./PublicLayout.jsx');
var _ = require('lodash');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var AuthActions = require('../actions/AuthActions');
var Link = require('./Link.jsx');

var WriteBusinessReviewConfirmationPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        return (
            <Layout context={this.props.context} customClass="bg-white">
                <div className="container review-confirmation" id="content">
                    <span className='check'>✓</span>
                    <p>
                        Merci, votre avis est en cours <br/>de publication. À bientôt sur Hairfie !
                    </p>
                    <Link className="btn btn-red" route="home">Retour sur la page d'accueil</Link>
                </div>
            </Layout>
        );
    }
});

module.exports = WriteBusinessReviewConfirmationPage;

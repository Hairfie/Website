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
var BreadCrumb = require('./Partial/Breadcrumb.jsx');

var WriteBusinessReviewConfirmationPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        return (
            <Layout context={this.props.context} customClass="bg-white">
                <div className="container review-confirmation" id="content">
                    <BreadCrumb business={this.props.business} />
                    <div className="flex-container">
                        <span className='check'>✓</span>
                        <p>
                            Merci, votre avis a bien été déposé. À bientôt sur Hairfie !
                        </p>
                        <Link className="btn btn-red" route="home">Retour sur la page d'accueil</Link>
                    </div>
                </div>
            </Layout>
        );
    }
});

WriteBusinessReviewConfirmationPage = connectToStores(WriteBusinessReviewConfirmationPage, [
    'BusinessReviewStore',
    'BusinessStore'
], function (context, props) {
    var review = context.getStore('BusinessReviewStore').getById(props.route.params.reviewId);
    var business = context.getStore('BusinessStore').getById(review.business.id);
    return {
        review: review,
        business: business
    };
});

module.exports = WriteBusinessReviewConfirmationPage;

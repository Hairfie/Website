'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PublicLayout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var BusinessReviewActions = require('../actions/BusinessReviewActions');
var _ = require('lodash');
var moment = require('moment');
var classNames = require('classnames');

var FacebookButton = require('./Auth/FacebookButton.jsx');
var FormConnect = require('./Auth/FormConnect.jsx');
var RatingInput = require('./Review/RatingInput.jsx');
var ReviewForm = require('./Review/ReviewForm.jsx');



var WriteVerifiedBusinessReviewPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        if (!this.props.currentUser) {
            return {
                formConnect: false
            };
        }
        return null;
    },
    render: function () {
        return( 
            <PublicLayout context={this.props.context} customClass="bg-white">
                <ReviewForm 
                    businessReviewRequest={this.props.businessReviewRequest} 
                    currentUser={this.props.currentUser}
                    reviewKind={this.props.reviewKind} 
                    business={this.props.business} 
                    onSubmit={this.submitReview} 
                    className="container write-review" 
                    id="content"/>
            </PublicLayout>
        );
    },
    submitReview: function(review) {
        console.log('REVIEW POSTED', review);
        this.context.executeAction(BusinessReviewActions.submitReview, {
            review: review,
            token: this.props.token
        });
    }
});

WriteVerifiedBusinessReviewPage = connectToStores(WriteVerifiedBusinessReviewPage, [
    'AuthStore',
    'UserStore',
    'BusinessStore',
    'BusinessReviewRequestStore'
], function (context, props) {
    var token = context.getStore('AuthStore').getToken();
    var businessReviewRequest = context.getStore('BusinessReviewRequestStore').getById(props.route.query.requestId) || null;
    
    var reviewKind;
    if (!businessReviewRequest) reviewKind = "FREE";
    else if (_.isEmpty(businessReviewRequest.booking)) reviewKind = "HAIRFIE";
    else reviewKind = "BOOKING";

    return {
        token: token,
        currentUser: context.getStore('UserStore').getById(token.userId),
        business: context.getStore('BusinessStore').getById(props.route.query.businessId),
        businessReviewRequest: businessReviewRequest,
        reviewKind: reviewKind
    };
});

module.exports = WriteVerifiedBusinessReviewPage;

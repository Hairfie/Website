'use strict';

var React = require('react');
var _ = require('lodash');
var SearchUtils = require('../../lib/search-utils');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Review = require('./Review.jsx');

var TopReviews = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <div className='top-reviews comments hidden-xs hidden-sm'>
                <h4>Les derniers avis</h4>
                {_.map(this.props.topReviews, function(review) {
                    return <Review key={review.id} review={review} topReviews={true} />
                })}
            </div>
        );
    }
});

TopReviews = connectToStores(TopReviews, ['BusinessReviewStore'], function (context) {
    return {
        topReviews: context.getStore('BusinessReviewStore').getTopReviews()
    };
});

module.exports = TopReviews;
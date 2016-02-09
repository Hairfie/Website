var React = require('react');
var _ = require('lodash');

var Rating = require('./Rating.jsx');
var Link = require('../Link.jsx');

module.exports = React.createClass({
    render: function() {
        var business = this.props.business;
        var numReviews = business.numReviews > 0 ? business.numReviews : null;
        if (!numReviews && business.yelpObject && business.shouldDisplayYelp) {
            numReviews = business.yelpObject.review_count > 0 ? business.yelpObject.review_count : null;
        }

        return (
            <div {...this.props}>
                <Rating business={business} />
                <Link route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} className="num-reviews">{numReviews ? (numReviews + ' avis') : ''}</Link>
            </div>
        )
    }
});
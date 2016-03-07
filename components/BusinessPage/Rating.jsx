var React = require('react');
var _ = require('lodash');

var Link = require('../Link.jsx');


module.exports = React.createClass({
    render: function () {
        var business = this.props.business || {};
        if (!business.numReviews && !business.yelpObject) return <span />;
        else if (business.numReviews) {
            var rating = Math.round(business.rating / 100 * 5);

            return (
                <div className="stars">
                    {_.map([1, 2, 3, 4, 5], function (starValue) {
                        return <Link key={starValue} route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} className={'star'+(starValue <= rating ? ' full' : '')} />
                    })}
                </div>
            );
        }
        else if (business.yelpObject.review_count > 0 && business.shouldDisplayYelp) {
            return (
                <img src={this.props.business.yelpObject.rating_img_url_large} alt="yelp" className="yelp-rating" />
            );
        } else {
            return null;
        }
    }
});
'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Layout = require('./BusinessPage/Layout.jsx');
var Link = require('./Link.jsx');
var UserProfilePicture = require('./Partial/UserProfilePicture.jsx');
var Rating = require('./Partial/Rating.jsx');
var Review = require('./Partial/Review.jsx');
var YelpReview = require('./Partial/YelpReview.jsx');
var LatestHairfies = require('./BusinessPage/LatestHairfies.jsx');

var BusinessReviewPage = React.createClass({
    render: function () {
        var reviews = this.props.reviews;


        if (!_.isArray(this.props.reviews)) {
            return (
                <Layout business={this.props.business} tab="reviews">
                        <div className="loading" />
                </Layout>
            );
        }

        if (_.isEmpty(this.props.reviews)) {
            return (
                <Layout business={this.props.business} tab="reviews" className="reviews">
                    <p className="text-center">
                        <br /><br />
                        Pas encore d'avis sur ce coiffeur.
                        <br /><br />
                        <Link route="write_business_review" className="btn btn-book" style={{fontSize: '1.3em'}} query={{businessId: this.props.business.id}}>Soyez le premier à déposer un avis</Link>
                    </p>
                    <LatestHairfies business={this.props.business} />
                </Layout>
            );
        }

        return (
            <Layout business={this.props.business} tab="reviews" className="reviews">
                <div className="reviews-title">
                    <p>Vous êtes déjà allé dans ce salon ?</p>
                    <Link route="write_business_review" query={{businessId: this.props.business.id}}>Donnez votre avis et aidez la communauté.</Link>
                </div>
                <div className="comments">
                    {_.map(reviews, function (review) {
                        return (
                            <Review review={review} />
                        );
                    }, this)}
                <BusinessYelpReviews business={this.props.business}/>
                    <p className="text-center">
                        <br /><br />
                        <br /><br />
                        <Link route="write_business_review" className="btn btn-book" style={{fontSize: '1.3em'}} query={{businessId: this.props.business.id}}>Déposez un avis</Link>
                    </p>
                </div>
            </Layout>
        );
    }
});

var BusinessYelpReviews = React.createClass ({
    render: function () {
        if (_.isEmpty(this.props.business.yelpObject) || this.props.business.yelpObject.review_count == 0) return null;
        else {
            return (
                <div>
                    <div className="reviews-title">
                        <p>Derniers avis Yelp</p>
                    </div>
                    <img src={this.props.business.yelpObject.rating_img_url_large} /> {'Note globale basée sur ' + this.props.business.yelpObject.review_count + ' avis'}
                    {_.map(this.props.business.yelpObject.reviews, function(review) {
                        return (
                            <YelpReview review={review} />
                        );   
                    }, this)}
                </div>
            );
        }
    }
});

BusinessReviewPage = connectToStores(BusinessReviewPage, [
    'BusinessStore',
    'BusinessReviewStore'
], function (context, props) {
    return {
        business: context.getStore('BusinessStore').getById(props.route.params.businessId),
        reviews: context.getStore('BusinessReviewStore').getLatestByBusiness(props.route.params.businessId)
    };
});

module.exports = BusinessReviewPage;

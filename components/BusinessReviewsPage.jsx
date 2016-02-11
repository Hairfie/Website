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
var Picture = require('./Partial/Picture.jsx');

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

        if (_.isEmpty(this.props.reviews) && (_.isEmpty(this.props.business.yelpObject) || this.props.business.yelpObject.review_count == 0) ) {
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
                <BusinessHairfieReviews business={this.props.business} reviews={this.props.reviews} />
                <BusinessYelpReviews business={this.props.business}/>
                <div className="text-center">
                    <Link route="write_business_review" className="btn btn-book" style={{fontSize: '1.3em'}} query={{businessId: this.props.business.id}}>Déposez un avis</Link>
                </div>
            </Layout>
        );
    }
});

var BusinessHairfieReviews = React.createClass ({
    render: function() {
        if (_.isEmpty(this.props.reviews) || this.props.business.numReviews == 0) return null;
        return (
            <div>
                <div className="reviews-title">
                    <p>Vous êtes déjà allé dans ce salon ?</p>
                    <Link route="write_business_review" query={{businessId: this.props.business.id}}>Donnez votre avis et aidez la communauté.</Link>
                </div>
                <div className="comments">
                    {_.map(this.props.reviews, function (review) {
                        return (
                            <Review key={review.id} review={review} />
                        );
                    }, this)}
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
});

var BusinessYelpReviews = React.createClass ({
    render: function () {
        if (!this.props.business.shouldDisplayYelp) return null;
        return (
            <div style={{marginTop: '20px'}}>
                <div className="yelp-title">
                    <span>Derniers avis Yelp</span>
                </div>
                    <div className="comments">
                        <img src={this.props.business.yelpObject.rating_img_url_large} className="note-yelp"/> 
                        <span className="note-yelp-info">{'Note globale basée sur ' + this.props.business.yelpObject.review_count + ' avis'}</span>
                        <a href={this.props.business.yelpObject.url} target="_blank">
                            {_.map(this.props.business.yelpObject.reviews, function(review) {
                                return (
                                    <YelpReview key={review.id} review={review} />
                                );   
                            }, this)}
                        </a>
                    </div>
                <div className="pull-right">
                    <Picture picture={{url: "/img/businessPage/yelp-powered.png"}} style={{width: 100}} alt="yelp-powered" />
                </div>
                <div className="clearfix"></div>
            </div>
        );
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

'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Layout = require('./BusinessPage/Layout.jsx');
var Link = require('./Link.jsx');
var UserProfilePicture = require('./Partial/UserProfilePicture.jsx');
var Rating = require('./Partial/Rating.jsx');

var moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }
function initials(u) { var u = u || {}; return (u.firstName || '').substr(0, 1)+(u.lastName || '').substr(0, 1); }

var BusinessReviewPage = React.createClass({
    render: function () {
        var reviews = this.props.reviews;

        var options = {
            width: 340,
            height: 340,
            crop: 'thumb',
            gravity: 'faces'
        };

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
                </Layout>
            );
        }

        return (
            <Layout business={this.props.business} tab="reviews" className="reviews">
                <div className="comments">
                    {_.map(reviews, function (review) {
                        return (
                            <div key={review.id} className="single-comment col-xs-12">
                                <span className="user-profil col-xs-1">
                                    <UserProfilePicture className="ProfilePicture" picture={review && review.author ? review.author.picture : ''} options={options} gender={review && review.author ? review.author.gender : ''}/>
                                </span>
                                {this.verified(review)}
                                <div className="col-xs-8">
                                    <p><Rating rating={review.rating} min={true} /></p>
                                    <p>{review.comment}</p>
                                    <div className="by-when">
                                        {displayName(review)} - {moment(review.createdAt).format('LL')}
                                    </div>
                                </div>
                            </div>
                        );
                    }, this)}
                    <p className="text-center">
                        <br /><br />
                        <br /><br />
                        <Link route="write_business_review" className="btn btn-book" style={{fontSize: '1.3em'}} query={{businessId: this.props.business.id}}>Déposez un avis</Link>
                    </p>
                </div>
            </Layout>
        );
    },
    verified: function(review) {
        if (review && !review.verified) return null;
        return (<strong className="pull-right red verified">Avis vérifié</strong>);
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

'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var UserLayout = require('./UserPage/Layout.jsx');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');
var UserProfilePicture = require('./Partial/UserProfilePicture.jsx');

var moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }
function initials(u) { var u = u || {}; return (u.firstName || '').substr(0, 1)+(u.lastName || '').substr(0, 1); }

var UserReviewsPage = React.createClass({
    render: function () {
        if (!_.isArray(this.props.reviews)) {
            return (
                <UserLayout user={this.props.user} tab="reviews">
                        <div className="loading" />
                </UserLayout>
            );
        }

        return(
            <UserLayout user={this.props.user} tab="reviews">
            {this.renderTitle()}
                <div className="comments">
                    {_.map(this.props.reviews, function (review) {
                        var business = review.business;
                        if (!business)
                            return;
                        var address = business.address;
                        var options = {
                        width: 340,
                        height: 340,
                        crop: 'thumb',
                        gravity: 'faces'
                        };
                        return (
                            <div key={review.id} className="single-comment col-xs-12">
                                <div className="col-sm-8 col-md-9 col-xs-12">
                                    <UserProfilePicture className="ProfilePicture" picture={review.author.picture} options={options} gender={review.author.gender}/>
                                    <Link route="business" className="hidden-lg hidden-sm hidden-md" params={{ businessId: business.id, businessSlug: business.slug }}>
                                        <p><strong className="icon-home">{business.name}</strong></p>
                                    </Link>
                                    <p><strong>Note : {Math.round(review.rating / 100 * 5)}/5</strong></p>
                                    <p>{review.comment}</p>
                                    <div className="by-when">
                                        {displayName(review)} - {moment(review.createdAt).format('LL')}
                                    </div>
                                </div>
                                <div className="col-sm-4 col-md-3 hidden-xs separate">
                                    <div>
                                        <h5>{business.name}</h5>
                                        <a href={"tel:" + business.phoneNumber}>{business.phoneNumber}</a>
                                    </div>
                                    <Link route="business" className="btn btn-red businessButton" params={{ businessId: business.id, businessSlug: business.slug }}>+ d'infos</Link>
                                    <Link route="business_hairfies" className="btn btn-red pull-right businessButton" params={{ businessId: business.id, businessSlug: business.slug }}>Ses Hairfies</Link>
                                </div>
                            </div>
                        );
                    }.bind(this))}
                </div>
            </UserLayout>
        );
    },
    renderTitle: function () {
        if (_.isEmpty(this.props.reviews))
            return <h3>{this.props.user.firstName} n'a pas encore laissé d'avis.</h3>
        return <h3>{this.props.user.firstName} a laissé des Avis</h3>;
    }
});

UserReviewsPage = connectToStores(UserReviewsPage, [
    'UserStore',
    'BusinessReviewStore'
], function (context, props) {
    return {
        user: context.getStore('UserStore').getById(props.route.params.userId),
        reviews: context.getStore('BusinessReviewStore').getReviewsByUser(props.route.params.userId)
    };
});

module.exports = UserReviewsPage;
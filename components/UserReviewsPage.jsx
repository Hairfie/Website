'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
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
                                <div className="col-xs-8 col-md-9">
                                    <UserProfilePicture className="ProfilePicture" picture={this.props.user.picture} options={options} gender={this.props.user.gender}/>
                                    <p><strong>Note : {Math.round(review.rating / 100 * 5)}/5</strong></p>
                                    <p>{review.comment}</p>
                                    <div className="by-when">
                                        {displayName(review)} - {moment(review.createdAt).format('LL')}
                                    </div>
                                </div>
                                <div className="col-xs-4 col-md-3 separate">
                                    <div>
                                        <h5>{business.name}</h5>
                                        <p>{address.street} {address.zipCode} {address.city}</p>
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
], function (stores, props) {
    return {
        user: stores.UserStore.getById(props.route.params.userId),
        reviews: stores.BusinessReviewStore.getReviewsByUser(props.route.params.userId)
    };
});

module.exports = UserReviewsPage;
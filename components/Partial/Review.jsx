'use strict';

var React = require('react');
var _ = require('lodash');
var UserProfilePicture = require('./UserProfilePicture.jsx');
var Rating = require('./Rating.jsx');
var Link = require('../Link.jsx');

var moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }
function initials(u) { var u = u || {}; return (u.firstName || '').substr(0, 1)+(u.lastName || '').substr(0, 1); }

module.exports = React.createClass({
    render: function () {
        var review = this.props.review;
        var options = {
            width: 340,
            height: 340,
            crop: 'thumb',
            gravity: 'faces'
        };

        var symbol = '';
        if (review.gender == 'FEMALE' || (!review.gender && review.author && review.author.gender == 'FEMALE')) {
            symbol = <span className="gender-symbol">&#9792;</span>
        }
        else if (review.gender == 'MALE' || (!review.gender && review.author && review.author.gender == 'MALE')) {
            symbol = <span className="gender-symbol">&#9794;</span>
        }

        return (
            <div className="single-comment col-xs-12">
                <div className="user-profil col-xs-3 col-sm-2">
                    <UserProfilePicture className={"ProfilePicture" + (review && review.author && review.author.picture ? '' : ' placeholder')}
                    picture={review && review.author ? review.author.picture : ''}
                    options={options} 
                    gender={review ? review.gender : ''}/>
                </div>
                <div className="col-xs-9 col-sm-10">
                    <div className="title">
                        <p>{displayName(review)}{symbol}</p>
                        <Rating rating={review.rating} min={true} className="review-rating" />
                    </div>
                    {this.verified(review)}
                </div>
                <p className="col-xs-12 col-sm-10 review">{review.comment}</p>
                {this.renderBusinessLink()}
            </div>
        );
    },
    verified: function(review) {
        if (review && !review.verified) return (<span className="yelp-date">Avis libre déposé le {moment(review.createdAt).format('LL')}</span>);;
        return (<span className="yelp-date ed">Avis vérifié déposé le {moment(review.createdAt).format('LL')}</span>);
    },
    renderBusinessLink: function() {
        var review = this.props.review;
        if(!this.props.topReviews) return;
        return (
            <div className="col-sm-offset-2 col-sm-10">
                <Link route="business" params={{ businessId: review.business.id, businessSlug: review.business.slug }}><h5>{'Voir le salon ' + review.business.name}</h5></Link>
            </div>
        );
    }
});
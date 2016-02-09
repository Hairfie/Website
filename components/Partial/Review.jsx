'use strict';

var React = require('react');
var _ = require('lodash');
var UserProfilePicture = require('./UserProfilePicture.jsx');
var Rating = require('./Rating.jsx');

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
                        <Rating rating={review.rating} min={true} className="pull-right" />
                    </div>
                    <p>{review.comment}</p>
                    {this.verified(review)}
                </div>
            </div>
        );
    },
    verified: function(review) {
        if (review && !review.verified) return (<strong className="pull-right darkgrey">Avis libre déposé le {moment(review.createdAt).format('LL')}</strong>);;
        return (<strong className="pull-right ed">Avis vérifié déposé le {moment(review.createdAt).format('LL')}</strong>);
    }
});
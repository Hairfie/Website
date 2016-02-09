'use strict';

var React = require('react');
var _ = require('lodash');
var UserProfilePicture = require('./UserProfilePicture.jsx');
var Rating = require('./Rating.jsx');

var moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

module.exports = React.createClass({
    render: function () {
        var review = this.props.review;
        return (
            <div className="single-comment col-xs-12">
                <div className="user-profil col-xs-3 col-sm-2">
                    <img src={review.user.image_url} className="ProfilePicture" />
                </div>
                <div className="col-xs-9 col-sm-10">
                    <div className="title">
                        <p>{review.user.name}</p>
                        <img src={review.rating_image_large_url} className="pull-right" style={{width: '120px'}}/>
                        <br/>
                        <span>{moment(review.time_created*1000).format('LL')}</span>
                    </div>
                    <p>{review.excerpt}</p>
                </div>
            </div>
        );
    }
});
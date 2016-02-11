'use strict';

var React = require('react');
var _ = require('lodash');
var UserProfilePicture = require('./UserProfilePicture.jsx');
var Rating = require('./Rating.jsx');
var Picture = require('../Partial/Picture.jsx');
var ReactFitText = require('react-fittext');

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
                        <div>
                            <p>{review.user.name + ' via Yelp'}</p>
                            <p>
                                <img src={review.rating_image_large_url} className="review-rating" style={{width: '120px'}}/>
                                <Picture picture={{url: "/img/businessPage/yelp.png"}} className="review-rating visible-xs mini-yelp" alt="yelp-reviews" />
                                <Picture picture={{url: "/img/businessPage/yelp-reviews.png"}} style={{width: 100, marginRight: '5px'}} className="review-rating hidden-xs" alt="yelp-reviews" />
                            </p>
                        </div>
                        <ReactFitText compressor={0.4} maxFontSize={14}>
                            <span className="yelp-date">{moment(review.time_created*1000).format('LL')}</span>
                        </ReactFitText>
                    </div>
                    
                </div>
                <p className="col-xs-12 col-sm-10 review">{review.excerpt}</p>
            </div>
        );
    }
});
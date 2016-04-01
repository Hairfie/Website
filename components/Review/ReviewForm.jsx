'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var RatingInput = require('./RatingInput.jsx');
var ReviewRating = require('./ReviewRating.jsx');
var AverageRating = require('./AverageRating.jsx');
var UserInfos = require('./UserInfos.jsx');
var BusinessInfos = require('./BusinessInfos.jsx');
var classNames = require('classnames');
var BreadCrumb = require('../Partial/Breadcrumb.jsx');

var RequiredAsterisk = React.createClass({
    render: function () {
        return <span className="required-asterisk">*</span>;
    }
});
var ReviewForm = React.createClass({
    getInitialState: function() {
        var brr = this.props.businessReviewRequest;
        var cu = this.props.currentUser;
        return {
            review  : {
                businessId  : this.props.business.id,
                requestId   : (brr && brr.id) || undefined,
                authorId    : cu ? cu.id : undefined,
                firstName   : (brr && brr.booking && brr.booking.firstName) || (cu && cu.firstName) || null,
                lastName    : (brr && brr.booking && brr.booking.lastName) || (cu && cu.lastName) || null,
                gender      : (brr && brr.booking && brr.booking.gender) || (cu && cu.gender) || null,
                email       : (brr && brr.email) || (cu && cu.email) || null,
                phoneNumber : (brr && brr.booking && brr.booking.phoneNumber) || (cu && cu.phoneNumber) || null,
                criteria    : null,
                comment     : null
            },
            page    : 1,
            error   : null
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (!nextProps.currentUser) return;
        var review = this.state.review;
        this.setState({
            review: _.assign({}, this.state.review, {
                firstName   : _.isNull(review.firstName) ? nextProps.currentUser.firstName : review.firstName, 
                lastName    : _.isNull(review.lastName) ? nextProps.currentUser.lastName : review.lastName, 
                gender      : _.isNull(review.gender) ? nextProps.currentUser.gender : review.gender, 
                email       : _.isNull(review.firstName) ? nextProps.currentUser.email : review.email, 
                phoneNumber : _.isNull(review.firstName) ? nextProps.currentUser.phoneNumber : review.phoneNumber
            })
        });
    },
    render: function () {
        var validateRating = this.validateRating();
        return (
            <div {...this.props}>
                <BreadCrumb business={this.props.business} />
                <BusinessInfos 
                    businessReviewRequest={this.props.businessReviewRequest} 
                    business={this.props.business}
                    className={'page' + this.state.page + ' business-infos'}/>
                <ReviewRating
                    ref='reviewRating'
                    handleCriteria={this.handleCriteria} 
                    review={this.state.review}
                    handlePage={this.handlePage}
                    validateRating={validateRating}
                    dots={this.renderDotPagination}
                    className={'page' + this.state.page + ' review-rating'}/>
                <AverageRating
                    ref='averageRating'
                    review={this.state.review} 
                    handlePage={this.handlePage}
                    validateRating={validateRating}
                    reviewKind={this.props.reviewKind}
                    handleComment={this.handleComment}
                    dots={this.renderDotPagination}
                    onSubmit={this.props.onSubmit}
                    className={'page' + this.state.page + ' average-rating'}/>
                <UserInfos 
                    review={this.state.review}
                    currentUser={this.props.currentUser}
                    handlePage={this.handlePage}
                    className={'page' + this.state.page + ' user-infos'}
                    dots={this.renderDotPagination}
                    businessReviewRequest={this.props.businessReviewRequest}
                    onSubmit={this.handleUserInfos} />
                {/*this.renderDotPagination()*/}
            </div>
        );
    },
    renderDotPagination: function() {
        var pages = this.props.reviewKind == 'BOOKING' ? [1, 2] : [1, 2, 3];
        return (
            <div className='dots'>
                {_.map(pages, function(page) {
                    return <span className={page == this.state.page ? 'red-dot' : 'grey-dot'}>&bull;</span>;
                }, this)}
            </div>
        );
    },
    handleUserInfos: function(user) {
        this.setState({review: _.assign({}, this.state.review, {
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            email: user.email,
            phoneNumber: user.phoneNumber
        })}, function() {this.props.onSubmit(this.state.review)});

    },
    handleComment: function() {
        this.setState({review: _.assign({}, this.state.review, {comment: this.refs.averageRating.refs.comment.getValue()})});
    },
    handleCriteria: function(ratingKind, ratingValue) {
        var criteria = 1;
        var rating = {};
        rating[ratingKind] = ratingValue;
        this.setState({review: _.assign({}, this.state.review, {criteria: _.assign({}, this.state.review.criteria, rating)})});
    },
    handlePage: function() {
        this.setState({page: (this.state.page + 1)});
        this.scrollToTop();
    },
    validateRating: function() {
        var criteria = this.state.review.criteria;
        var result =  !(_.isNull(criteria) || _.isUndefined(criteria.business) 
                                           || _.isUndefined(criteria.businessMember) 
                                           || _.isUndefined(criteria.haircut));
        return result;
    },
    scrollTo: function(toRef) {
        var target = ReactDOM.findDOMNode(this.refs[toRef]);
        if (window.innerWidth <= 768 && target)
            TweenMax.to(window, 0.5, {scrollTo:{y:target.offsetTop - 65}, ease:Power2.easeOut});
    },
    scrollToTop: function() {
        TweenMax.to(window, 0.5, {scrollTo:{y:0}, ease:Power2.easeOut});
    }
});

module.exports = ReviewForm;

'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var RatingInput = require('./RatingInput.jsx');
var classNames = require('classnames');

var ReviewRating = React.createClass ({
    getDefaultProps: function () {
        return {
            handlePage: _.noop,
            review: _.noop,
            validateRating: _.noop
        }
    },
    render: function() {
        var ratingIsDone = classNames({'hidden': !this.props.validateRating});
        return (
            <div {...this.props}>
                {this.averageRating()}
                <Button className={ratingIsDone} onClick={this.props.handlePage}>Suivant</Button>
            </div>
        );
    },
    averageRating: function() {

        if (!this.props.review.criteria) return;
        var business = this.props.review.criteria.business ? this.props.review.criteria.business : 0;
        var businessMember = this.props.review.criteria.businessMember ? this.props.review.criteria.businessMember : 0;
        var haircut = this.props.review.criteria.haircut ? this.props.review.criteria.haircut : 0;
        var div;
        div = business > 0 ? 1 : 0;
        div = businessMember > 0 ? div + 1 : div + 0;
        div = haircut > 0 ? div + 1 : div + 0;
        var avg = ( business + businessMember + haircut) / (div * 20);
        avg = Math.round(avg * 10) / 10;
        return 'Moyenne : ' + avg;
    }

});

module.exports = ReviewRating;
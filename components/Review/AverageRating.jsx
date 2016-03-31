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
            review: _.noop
        }
    },
    render: function() {
        var ratingIsDone = classNames({'hidden': !this.props.validateRating});
        var button = this.props.reviewKind == 'BOOKING' ? <Button className={'btn btn-book ' + ratingIsDone} onClick={this.props.onSubmit.bind(null, this.props.review)}>Poster votre avis</Button> : <Button className={'btn btn-book ' + ratingIsDone} onClick={this.props.handlePage}>Suivant</Button>
        return (
            <div {...this.props}>
                {this.averageRating()}
                <Input ref="comment" type="textarea" placeholder="Un commentaire ? (facultatif)" onChange={this.props.handleComment} />
                {button}
            </div>
        );
    },
    /*
    ** Calcul de la moyenne:
    ** business -> 25%
    ** businessMember -> 25%
    ** haircut -> 50%
    */
    averageRating: function() {

        if (!this.props.validateRating) return;
        var business = this.props.review.criteria.business ? this.props.review.criteria.business : 0;
        var businessMember = this.props.review.criteria.businessMember ? this.props.review.criteria.businessMember : 0;
        var haircut = this.props.review.criteria.haircut ? this.props.review.criteria.haircut : 0;
        var div, avg, res, i;

        div = business > 0 ? 1 : 0;
        div = businessMember > 0 ? div + 1 : div + 0;
        div = haircut > 0 ? div + 2 : div + 0;

        avg = ( business + businessMember + haircut * 2) / (div * 20);
        avg = Math.round(avg * 10) / 10;

        return (
            <div className='flex-container'>
                <div className='flex-container2'>
                    <label>Note Globale</label>
                    <div className="sub-label">{avg + ' / 5'}</div>
                </div>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map(function (n) { return this.renderStar(n, avg); }.bind(this))}
                </div>
            </div>
        );
    },
    renderStar: function(n, avg) {

        var on = n <= Math.round(avg);
        var className = classNames({
            star: true,
            full: on,
            on  : on,
            off : !on
        });
        return <a role="button" key={n} className={className} style={{margin: '3px'}}></a>;

    }

});

module.exports = ReviewRating;
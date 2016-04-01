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
            handleCriteria: _.noop,
            review: _.noop
        }
    },
    render: function() {
        var ratingIsDone = classNames({'btn btn-book': true, 'hidden-sm': true, 'hidden-md':true, 'hidden-lg':true, 'disabled': !this.props.validateRating});
        return (
            <div {...this.props}>
                <RatingInput ref="business" label="Le salon (25% de la note)" subLabel='Décoration, propreté' className="interactive" onChange={this._handleRatingInputChange.bind(this, 'business')}/>
                <RatingInput ref="businessMember" label="Le coiffeur (25% de la note)" subLabel='Accueil, écoute, amabilité' className="interactive" onChange={this._handleRatingInputChange.bind(this, 'businessMember')} />
                <RatingInput ref="haircut" label="La coupe (50% de la note)" subLabel='Résultat final, style' className="interactive" onChange={this._handleRatingInputChange.bind(this, 'haircut')} />
                <div className="bottom-bar">
                    {this.props.dots()}
                    <Button className={ratingIsDone} onClick={this.props.handlePage}>Suivant</Button>
                </div>
            </div>
        );
    },
    _handleRatingInputChange: function(criteria) {
        var criteriaValue = this.refs[criteria].getValue();
        this.props.handleCriteria(criteria, criteriaValue);
    }

});

module.exports = ReviewRating;
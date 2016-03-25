'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var RatingInput = require('./RatingInput.jsx');

var ReviewRating = React.createClass ({
    getDefaultProps: function () {
        return {
            handleCriteria: _.noop
        }
    },
    render: function() {
        return (
            <div {...this.props}>
                <RatingInput ref="business" label="Le salon (25% de la note)" className="interactive" onChange={this._handleRatingInputChange.bind(this, 'business')}/>
                <RatingInput ref="businessMember" label="Le coiffeur" className="interactive" onChange={this._handleRatingInputChange.bind(this, 'businessMember')} />
                <RatingInput ref="haircut" label="La coupe" className="interactive" onChange={this._handleRatingInputChange.bind(this, 'haircut')} />
                <Button className="visible-xs" onClick={this.props.handlePage}>Suivant</Button>
            </div>
        );
    },
    _handleRatingInputChange: function(criteria) {
        var criteriaValue = this.refs[criteria].getValue();
        this.props.handleCriteria(criteria, criteriaValue);
    }

});

module.exports = ReviewRating;
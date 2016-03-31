'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var classNames = require('classnames');
var Picture = require('../Partial/Picture.jsx');

var BusinessInfos = React.createClass ({
    render: function() {
        var business = this.props.business;
        var displayAddress = business.address ? business.address.street + ' ' + business.address.zipCode + ' ' + business.address.city : null;
        return (
            <div {...this.props}>
                <h4>{'Votre avis sur ' + business.name}</h4>
                <div className="flex-container">
                    <Picture picture={business.pictures[0]}
                       resolution={{width: 80, height: 80}}
                       placeholder="/img/placeholder-55.png" />
                    <div className='text-bloc'>
                        <h5>{business.name}</h5>
                        <div>{displayAddress}</div>
                        {this.renderBookingDate()}
                    </div>
                </div>
            </div>
        );
    },
    renderBookingDate: function() {
        if (!this.props.businessReviewRequest || !this.props.businessReviewRequest.booking) return;
        return (
            <div>
                {'Le ' + this.props.businessReviewRequest.booking.displayDateTime}
            </div>
        );
    }

});

module.exports = BusinessInfos;
'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');
var moment = require('moment');

var DateTimeConstants = require('../../constants/DateTimeConstants');
var orderWeekDays = DateTimeConstants.orderWeekDays;
var weekDayLabel = DateTimeConstants.weekDayLabelFR;

var BookingSummary = React.createClass({
    render: function () {
        var business = this.props.business;
        var displayAddress = business.address ? business.address.street + ' ' + business.address.zipCode + ' ' + business.address.city : null;

        return (
            <div className="booking-summary row">
                <div className="salon-bloc col-xs-12 col-sm-4">
                    <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                        <Picture picture={business.pictures[0]}
                           resolution={{width: 55, height: 55}}
                           placeholder="/img/placeholder-55.png" />
                    </Link>
                    <div className="address-bloc">
                        <h2>
                            <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                                {business.name}
                            </Link>
                        </h2>
                        <Link className="address" route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                            {displayAddress}
                        </Link>
                    </div>
                </div>
                <hr className="visible-xs" />
                <div className="promo-bloc col-xs-12 col-sm-4">
                    {this.renderSelectedSlot()}
                    {this.renderDiscountsNode()}
                    {this.renderBookingDiscount()}
                    <div>
                        {this.renderDiscountsConditions()}
                    </div>
                </div>
                {this.renderEditButton()}
            </div>
        )
    },
    renderEditButton: function() {
        if (!this.props.booking && !this.props.timeslotSelected) return null;
        var button;
        if (this.props.timeslotSelected) {
            button = <button className="btn btn-whitered" onClick={this.props.modifyTimeslot}>Modifier le RDV</button>;
        }
        if (this.props.booking) {
            button = <Link route="business_booking" className="btn btn-whitered" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }}>Modifier le RDV </Link>;
        }
        return (
            <div className='edit-bloc  col-xs-12 col-sm-4'>
                <hr className="visible-xs" />
                <div className="edit">
                    {button}
                </div>
            </div>
        );
    },
    renderSelectedSlot: function() {
        var selectedSlot = 'Choisissez un rendez-vous';
        if (this.props.booking) {
            selectedSlot = moment(this.props.booking.timeslot).format("[Le] dddd D MMMM YYYY [à] HH:mm");
        }
        else if (this.props.timeslotSelected) {
            selectedSlot = this.props.timeslotSelected.format("[Le] dddd D MMMM YYYY [à] HH:mm");
        }
        return (
            <div className="selected-slot">
                {selectedSlot}
            </div>
        );
    },
    renderBookingDiscount: function() {
        if (this.props.booking && this.props.booking.discount) {
            return (
                <div className="promo">
                    {'-' + this.props.booking.discount + '% sur toutes les prestations'}
                </div>
            ); 
        }
    },
    renderDiscountsNode: function() {
        var discounts = this.props.discountObj && this.props.discountObj.discountsAvailable;

        if(_.isEmpty(discounts)) {
            return null;
        }

        return (
            <div className="promo">
                { _.map(discounts, this.renderDiscountNode, this) }
            </div>
        );
    },
    renderDiscountNode: function(days, amount) {
        if (!_.isArray(days)) days = [days];
        return (
            <span className="discount">
                {amount}% sur toutes les prestations et tous les achats.
                Disponible {_.map(orderWeekDays(days), weekDayLabel, this).join(' ')}.
            </span>
        );
    },
    renderDiscountsConditions: function() {
        if(this.props.discountObj && this.props.discountObj.discountsAvailable.length > 0) {
            return (<span>* Cette offre n'est valable que pour les réservations en ligne. L'achat de produits du salon avec cette offre est exclusivement liée à une prestation.</span>);
        }
    }
});

module.exports = BookingSummary;

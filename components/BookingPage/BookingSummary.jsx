'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');

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
                    <div>
                        {this.renderDiscountsConditions()}
                    </div>
                </div>
                {this.renderEditButton()}
            </div>
        )
    },
    renderEditButton: function() {
        if (!this.props.daySelected || !this.props.timeslotSelected) return null;
        return (
            <div className='edit-bloc  col-xs-12 col-sm-4'>
                <hr className="visible-xs" />
                <div className="edit">
                    <button className="btn btn-whitered" onClick={this.props.modifyTimeslot}>Modifier le RDV</button>
                </div>
            </div>
        );
    },
    renderSelectedSlot: function() {
        var selectSlot = 'Choisissez un rendez-vous';
        if (this.props.daySelected && this.props.timeslotSelected) {
            selectSlot = this.props.timeslotSelected.format("[Le] dddd D MMMM YYYY [ à ] HH:mm");
        }
        return (
            <div className="selected-slot">
                {selectSlot}
            </div>
        );
    },
    renderDiscountsNode: function() {
        var business = this.props.business,
            discounts = this.props.discountObj && this.props.discountObj.discountsAvailable;

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

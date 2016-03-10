'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');
var moment = require('moment');
var BookingStatus = require('../../constants/BookingConstants').Status;
var AddToCalendarButton = require('../Partial/AddToCalendarButton.jsx');

var DateTimeConstants = require('../../constants/DateTimeConstants');
var orderWeekDays = DateTimeConstants.orderWeekDays;
var weekDayLabel = DateTimeConstants.weekDayLabelFR;

var BookingSummary = React.createClass({
    render: function () {
        var business = this.props.business;
        var booking = this.props.booking;
        var phoneNumber = booking && booking.status == BookingStatus.CONFIRMED ? booking.business.phoneNumber : null;
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
                        <a className="phone" href={"tel:" + phoneNumber}>{phoneNumber}</a>
                    </div>
                </div>
                <hr className="visible-xs" />
                <div className="promo-bloc col-xs-12 col-sm-4">
                    {this.renderSelectedSlot()}
                    {this.renderDiscountsNode()}
                    {this.renderBookingDiscount()}
                    {this.renderCutInfos()}    
                    <div>
                        {this.renderDiscountsConditions()}
                    </div>
                </div>
                {this.renderButtons()}
            </div>
        )
    },
    renderCalendarButton: function() {
        var booking = this.props.booking;
        if(!booking || booking.status == BookingStatus.CANCELLED || booking.status == BookingStatus.HONORED || booking.status == BookingStatus.NOT_CONFIRMED || booking.status == BookingStatus.CANCEL_REQUEST) return;
        var address = booking.business.address;
        return (
            <AddToCalendarButton
                    className="btn-whitered"
                    eventTitle={"Hairfie : votre RDV chez " + booking.business.name}
                    description={"RDV au " + address.street + ' ' + address.zipCode + ' ' + address.city + " le " + moment(booking.timeslot).format("dddd D MMMM YYYY [à] HH:mm")}
                    date={booking.timeslot}
                    duration={60}
                    address={address.street + ' ' + address.zipCode + ' ' + address.city}>
                    Ajouter à mon calendrier
                </AddToCalendarButton>
        );
    },
    renderCutInfos: function() {
        var booking = this.props.booking;
        if (booking) {
            var civ = booking.gender == 'MALE' ? 'M. ' : 'Mme ';
            var prestation = booking.service ? 'Prestation : ' + booking.service : null;
            return (
                <div className="booking-infos">
                    <div>{'Nom : ' + civ + booking.firstName + ' ' + booking.lastName}</div>
                    <div>{prestation}</div>
                    <div>{booking.comment}</div>
                </div>
            );
        }
    },
    renderButtons: function() {
        if (!this.props.booking && !this.props.timeslotSelected) return null;
        var cancelButton, button;
        var booking = this.props.booking;
        if(booking && (booking.status == BookingStatus.REQUEST || booking.status == BookingStatus.IN_PROCESS || booking.status == BookingStatus.CONFIRMED)) {
            cancelButton = (<button role="button" className="btn-whitered" onClick={this.props.cancelled}>Je veux annuler mon RDV</button>);
        }
        if (this.props.timeslotSelected) {
            button = <button className="btn btn-whitered" onClick={this.props.modifyTimeslot}>Modifier le RDV</button>;
        }
        // if (this.props.booking && booking.status == BookingStatus.NOT_CONFIRMED ) {
        //     button = <Link route="business_booking" className="btn btn-whitered" params={{ businessId: this.props.business.id, businessSlug: this.props.business.slug }}>Modifier le RDV </Link>;
        // }
        return (
            <div className='edit-bloc  col-xs-12 col-sm-4'>
                <hr className="visible-xs" />
                <div className="edit">
                    {button}
                    {cancelButton}
                    {this.renderCalendarButton()}
                </div>
            </div>
        );
    },
    renderSelectedSlot: function() {
        var selectedSlot = 'Choisissez une date et un horaire';
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
        else if (this.props.timeslotSelected) {
            if (!this.props.discountOnSelection) return;
            return (
                <div className="promo">
                        {'-' + this.props.discountOnSelection + '% sur toutes les prestations'}
                </div>
            );
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
            <span className="discount" key={days.toString() + '-' + amount.toString()}>
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

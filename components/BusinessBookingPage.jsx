'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var PublicLayout  = require('./PublicLayout.jsx');
var BookingCalendar = require('./Form/BookingCalendarComponent.jsx');
var TimeSelect = require('./BookingPage/TimeSelectComponent.jsx');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
var InfoForm = require('./BookingPage/InfoForm.jsx');
var Breadcrumb = require('./BookingPage/Breadcrumb.jsx');
var BookingActions = require('../actions/BookingActions');
var LibPhoneNumber = require('google-libphonenumber');

var BusinessBookingPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            daySelected: this.props.daySelected
        };
    },
    render: function () {
        var loading = _.isUndefined(this.props.business);
        return (
            <PublicLayout loading={loading} customClass="booking">
                {this.renderBookingForm()}
            </PublicLayout>
        );
    },
    renderBookingForm: function() {
        var formNode = this.state.timeslotSelected ? this.renderInfoForm() : this.renderDateAndTimeForm();
        var className = this.state.timeslotSelected ? "container reservation confirmation" : "container reservation";
        return (
            <div className={className} id="content" >
                <div className="row">
                    <Breadcrumb business={this.props.business} />
                    {formNode}
                    <LeftColumn business={this.props.business} discountObj={this.props.discountObj} />
                </div>
            </div>
        );
    },
    renderDateAndTimeForm: function() {
        var timetable = this.props.business.timetable;

        return (
            <div className="main-content col-md-9 col-sm-12 pull-right">
                <h3>Demande de réservation</h3>
                {this.renderIsBookable}
                <div className="row">
                    <div className="col-xs-6">
                        <h2>Choisissez votre date</h2>
                        <BookingCalendar onDayChange={this.handleDaySelectedChange} timetable={timetable} defaultDate={this.state.daySelected}/>
                    </div>
                    <div className="col-xs-6">
                        <h2>À quelle heure ?</h2>
                        <TimeSelect onTimeSlotChange={this.handleTimeSlotSelectedChange} timetable={timetable} daySelected={this.state.daySelected} />
                    </div>
                </div>
            </div>
        );
    },
    renderIsBookable: function() {
        if (!this.props.business.isBookable)
        {
            var phoneNumber = LibPhoneNumber.phoneUtil.parse(business.phoneNumber, 'FR');
            var phone = LibPhoneNumber.phoneUtil.format(phoneNumber, LibPhoneNumber.PhoneNumberFormat.INTERNATIONAL); 
            return (<h2>
                        Malheureusement, ce salon ne prend pas de réservation. Pour contacter ce salon, appelez le <a href={"tel:"+phone.replace(/ /g,"")}>{phone}</a> ou envoyez nous un email à <a href="mailto:hello@hairfie.com">hello@hairfie.com</a>
                    </h2>
                    );
        }
        return;
    },
    renderInfoForm: function() {
        return (
            <div className="main-content col-md-9 col-sm-12 pull-right">
                <InfoForm
                    ref="booking"
                    modifyTimeslot={this.handleDaySelectedChange.bind(null, this.state.daySelected)}
                    onSubmit={this.handleSubmit}
                    daySelected={this.state.daySelected}
                    timeslotSelected={this.state.timeslotSelected}
                    discount={this.state.discount}
                    business={this.props.business}
                />
            </div>
        );
    },
    handleDaySelectedChange: function(m) {
        this.setState({daySelected: moment(m), timeslotSelected: null});
    },
    handleTimeSlotSelectedChange: function(timeslotSelected, discount) {
        this.setState({timeslotSelected: timeslotSelected, discount: discount});
    },
    handleSubmit: function() {
        var booking = this.refs.booking.getBookingInfo();
        this.context.executeAction(BookingActions.submitBooking, booking);
    }
});

BusinessBookingPage = connectToStores(BusinessBookingPage, [
    'BusinessStore'
], function (stores, props) {
    return {
        business    : stores.BusinessStore.getById(props.route.params.businessId),
        discountObj : stores.BusinessStore.getDiscountForBusiness(props.route.params.businessId),
        daySelected : props.route.query.date ? moment(props.route.query.date) : null
    }
});

module.exports = BusinessBookingPage;

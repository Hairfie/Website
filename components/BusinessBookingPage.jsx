'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PublicLayout  = require('./PublicLayout.jsx');
var BookingCalendar = require('./Form/BookingCalendarComponent.jsx');
var TimeSelect = require('./BookingPage/TimeSelectComponent.jsx');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
var InfoForm = require('./BookingPage/InfoForm.jsx');
var Breadcrumb = require('./BookingPage/Breadcrumb.jsx');
var BookingActions = require('../actions/BookingActions');
var NotificationActions = require('../actions/NotificationActions');
var BusinessActions = require('../actions/BusinessActions');

var BusinessBookingPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function () {
        this.context.executeAction(BusinessActions.loadBusinessTimeslots, {
            from: moment().day(1).format('YYYY-MM-DD'),
            until: moment().day(1).add(1, "M").format('YYYY-MM-DD')
        });
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
        var className = this.state.timeslotSelected ? "container reservation bookingForm" : "container reservation";
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
                {this.renderIsBookable()}
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
            return (<h2>
                        Malheureusement, ce salon ne prend pas de réservation. Pour contacter ce salon, appelez le <a href={"tel:"+this.props.business.phoneNumber.replace(/ /g,"")}>{this.props.business.phoneNumber}</a> ou envoyez nous un email à <a href="mailto:hello@hairfie.com">hello@hairfie.com</a>
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
                    currentUser={this.props.currentUser}
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
        var cgu = this.refs.booking.getCGUStatus();
        if (!cgu)
            return this.context.executeAction(
                NotificationActions.notifyFailure,
                "Vous devez accepter les conditions générales d'utilisations pour finaliser l'inscription"
            );
        var booking = this.refs.booking.getBookingInfo();
        this.context.executeAction(BookingActions.submitBooking, booking);
    }
});

BusinessBookingPage = connectToStores(BusinessBookingPage, [
    'BusinessStore',
    'AuthStore',
    'UserStore'
], function (context, props) {
    var token = context.getStore('AuthStore').getToken();
    return {
        business    : context.getStore('BusinessStore').getById(props.route.params.businessId),
        businessTimeslots : context.getStore('BusinessStore').getTimeslotsById(props.route.params.businessId),
        discountObj : context.getStore('BusinessStore').getDiscountForBusiness(props.route.params.businessId),
        daySelected : props.route.query.date ? moment(props.route.query.date) : null,
        currentUser: context.getStore('UserStore').getById(token.userId)
    }
});

module.exports = BusinessBookingPage;

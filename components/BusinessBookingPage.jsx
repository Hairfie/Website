'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var moment = require('moment');
var _ = require('lodash');

var BusinessStore = require('../stores/BusinessStore');
var BookingStore  = require('../stores/BookingStore');

var BookingActions = require('../actions/Booking');

var PublicLayout  = require('./PublicLayout.jsx');

var BookingCalendar = require('./Form/BookingCalendarComponent.jsx');
var TimeSelect = require('./BookingPage/TimeSelectComponent.jsx');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
var InfoForm = require('./BookingPage/InfoForm.jsx');
var Breadcrumb = require('./BookingPage/Breadcrumb.jsx');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

var DateTimeConstants = require('../constants/DateTimeConstants');
var weekDayLabelFromInt = DateTimeConstants.weekDayLabelFromInt;

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore, BookingStore]
    },
    getStateFromStores: function () {
        return {
            business    : this.getStore(BusinessStore).getById(this.props.route.params.businessId),
            discountObj : this.getStore(BusinessStore).getDiscountForBusiness(this.props.route.params.businessId),
            daySelected : this.props.route.query.date ? moment(this.props.route.query.date) : null
        }
    },
    getInitialState: function () {
        return this.getStateFromStores()
    },
    render: function () {
        var loading = _.isUndefined(this.state.business);
        return (
            <PublicLayout loading={loading} context={this.props.context} customClass="booking">
                {this.renderBookingForm()}
                <div className="row" />
            </PublicLayout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    renderBookingForm: function() {
        var formNode = this.state.timeslotSelected ? this.renderInfoForm() : this.renderDateAndTimeForm();
        var className = this.state.timeslotSelected ? "container reservation confirmation" : "container reservation";
        return (
            <div className={className} id="content" >
                <div className="row">
                    <Breadcrumb context={this.props.context} business={this.state.business} />
                    {formNode}
                    <LeftColumn context={this.props.context} business={this.state.business} discountObj={this.state.discountObj} />
                </div>
            </div>
        );
    },
    renderDateAndTimeForm: function() {
        return (
            <div className="main-content col-md-9 col-sm-12 pull-right">
                <h3>Demande de réservation</h3>
                <div className="row">
                    <div className="col-xs-6">
                        <h2>Choisissez votre date</h2>
                        <BookingCalendar onDayChange={this.handleDaySelectedChange} timetable={this.state.business.timetable} defaultDate={this.state.daySelected}/>
                    </div>
                    <div className="col-xs-6">
                        <h2>À quelle heure ?</h2>
                        <TimeSelect onTimeSlotChange={this.handleTimeSlotSelectedChange} timetable={this.state.business.timetable} daySelected={this.state.daySelected} />
                    </div>
                </div>
            </div>
        );
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
                    business={this.state.business}
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
        this.executeAction(BookingActions.Save, {
            booking: booking
        });
    }
});

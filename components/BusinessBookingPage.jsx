'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PublicLayout  = require('./PublicLayout.jsx');
var BookingCalendar = require('./Form/BookingCalendarComponent.jsx');
var TimeSelect = require('./BookingPage/TimeSelectComponent.jsx');
var BookingSummary = require('./BookingPage/BookingSummary.jsx');
var InfoForm = require('./BookingPage/InfoForm.jsx');
var Breadcrumb = require('./Partial/Breadcrumb.jsx');
var BookingActions = require('../actions/BookingActions');
var NotificationActions = require('../actions/NotificationActions');
var BusinessActions = require('../actions/BusinessActions');
var classNames = require('classnames');
var PhoneButton = require('./BusinessPage/PhoneButton.jsx');
var ga = require('../services/analytics');

moment.locale('fr')

var BusinessBookingPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            daySelected: this.props.daySelected,
            displayPhoneNumber: false
        };
    },
    render: function () {
        var loading = _.isUndefined(this.props.business);
        console.log('daySelected', this.state.daySelected);
        return (
            <PublicLayout loading={loading} customClass="booking bg-white">
                {this.renderBookingForm()}
            </PublicLayout>
        );
    },
    renderBookingForm: function() {
        var formNode = this.state.timeslotSelected ? this.renderInfoForm() : this.renderDateAndTimeForm();
        var className = this.state.timeslotSelected ? "container reservation bookingForm" : "container reservation";
        var booking = {};
        booking.timeslot = this.state.timeslotSelected ? this.state.timeslotSelected : null;
        return (
            <div className={className} id="content" >
                <Breadcrumb business={this.props.business} />
                <BookingSummary 
                    business={this.props.business}
                    discountObj={this.props.discountObj} 
                    daySelected={this.state.daySelected}
                    timeslotSelected={this.state.timeslotSelected}
                    discountOnSelection={this.state.discount}
                    modifyTimeslot={this.handleDaySelectedChange.bind(null, this.state.daySelected)} />
                {formNode}
            </div>
        );
    },
    renderDateAndTimeForm: function() {
        var timetable = this.props.business.timetable;
        var hourTitle = null;
        if (this.state.daySelected)
            hourTitle = 'À quelle heure ?';
        var timeSelectZoneContent = (
            <div>
                <h2 className="hourTitle">{hourTitle}</h2>
                <TimeSelect 
                    onTimeSlotChange={this.handleTimeSlotSelectedChange} 
                    businessId={this.props.business.id} 
                    daySelected={this.state.daySelected} 
                    ref="timeSelect" />
            </div>
        );
        if (_.isNull(this.state.daySelected))
            timeSelectZoneContent = this.renderPlaceholder();
        if (this.state.daySelected == moment('2016-05-24').format('YYYY-MM-DD')) {
            timeSelectZoneContent = this.renderDisplayPhoneNumber();
        }

        return (
            <div className="main-content">
                {this.renderIsBookable()}
                <div className="row">
                    <div className="calendar col-xs-12 col-sm-6 col-md-5">
                        <h2 className="dateTitle">Quand êtes-vous disponible ?</h2>
                        <BookingCalendar onDayChange={this.handleDaySelectedChange} businessId={this.props.business.id} defaultDate={this.state.daySelected}/>
                    </div>
                    <div className="calendar col-xs-12 col-sm-6 col-md-4" ref="timeSelectContainer">
                        {timeSelectZoneContent}
                    </div>
                </div>
            </div>
        );
    },
    renderPlaceholder: function() {
        return (
            <div className='timepicker-placeholder'>
                <span className='date-icon'/>
                <span className='text-center'>Pour commencer, sélectionnez la date<br/> qui vous convient.</span>
            </div>
        );
    },
    renderDisplayPhoneNumber: function() {
        var phoneNumber = <a className='btn-red' onClick={this.handlePhoneNumber}>Afficher le numéro</a>;
        if (this.state.displayPhoneNumber)
            phoneNumber = <a href={"tel:" + this.props.business.phoneNumber.replace(/ /g,"")} className='btn-red'>{this.props.business.phoneNumber}</a>;
        return (
            <div className='timepicker-placeholder'>
                <span className='text-center'>Pour les rendez-vous le jour même, nous vous conseillons d'appeler directement le salon de coiffure.</span>
                {phoneNumber}
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
            <div className="main-content row" ref="bookingContainer">
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
    scrollTo: function(toRef) {
        var target = ReactDOM.findDOMNode(this.refs[toRef]);
        if (window.innerWidth <= 768 && target)
            TweenMax.to(window, 0.5, {scrollTo:{y:target.offsetTop - 65}, ease:Power2.easeOut});
    },
    scrollToTop: function() {
        TweenMax.to(window, 0.5, {scrollTo:{y:0}, ease:Power2.easeOut});
    },
    handleDaySelectedChange: function(m) {
        this.setState({daySelected: m, timeslotSelected: null}, this.scrollTo("timeSelectContainer"));
    },
    handleTimeSlotSelectedChange: function(timeslotSelected, discount) {
        this.scrollToTop();
        this.setState({timeslotSelected: timeslotSelected, discount: discount});
    },
    handlePhoneNumber: function(e) {
        e.preventDefault();
        if(ga) {
            var eventAction = 'call';
            if(this.props.business.accountType == 'BASIC') eventAction += ' BASIC';
            if(this.props.business.accountType == 'FREE') eventAction += ' FREE';

            ga('send', {
              hitType: 'event',
              eventCategory: 'Call Resa',
              eventAction: eventAction,
              eventLabel: this.props.business.name
            });
        }
        this.setState({displayPhoneNumber: true});
    },
    handleSubmit: function(booking) {
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
        discountObj : context.getStore('BusinessStore').getDiscountForBusiness(props.route.params.businessId),
        daySelected : props.route.query.date ? props.route.query.date : null,
        currentUser: context.getStore('UserStore').getById(token.userId)
    }
});

module.exports = BusinessBookingPage;

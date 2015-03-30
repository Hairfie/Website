/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var moment = require('moment');
var _ = require('lodash');

var BusinessStore = require('../stores/BusinessStore');
var BookingStore  = require('../stores/BookingStore');

var PublicLayout  = require('./PublicLayout.jsx');

var BookingCalendar = require('./Form/BookingCalendarComponent.jsx');
var TimeSelect = require('./BookingPage/TimeSelectComponent.jsx');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
var Breadcrumb = require('./BookingPage/Breadcrumb.jsx');

var UserConstants = require('../constants/UserConstants');

var BookingActions = require('../actions/Booking');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

var DateTimeConstants = require('../constants/DateTimeConstants');
var weekDayLabelFromInt = DateTimeConstants.weekDayLabelFromInt;

var RightColumn = React.createClass({
    render: function() {

    }
});

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
        var business = this.state.business,
            context = this.props.context,
            timeslotNode;

        if(this.state.timeslot) {
            var timeSlotLabel = this.state.timeslot.format("[Demande pour le] D/MM/YYYY [à] HH:mm");
            if(this.state.discount) timeSlotLabel += ' avec -' + this.state.discount + '%';
            timeslotNode = (
                <Input type="text"  value={timeSlotLabel} disabled />
            );
        } else {
            timeslotNode = (
                <div className="form-group">
                    <span>
                        Commencez par choisir une date et un horaire.
                    </span>
                </div>
            );
        }

        return (
            <div className="container reservation" id="content" >
                <div className="row">
                    <Breadcrumb context={this.props.context} business={this.state.business} />
                    <LeftColumn context={this.props.context} business={this.state.business} discountObj={this.state.discountObj} />
                    <div className="main-content col-sm-8">
                        <h3>Demande de réservation</h3>
                        <div className="row">
                            <div className="col-xs-6">
                                <h2>Choisissez votre date</h2>
                                <BookingCalendar onDayChange={this.handleDaySelectedChange} timetable={business.timetable} defaultDate={this.state.daySelected}/>
                            </div>
                            <div className="col-xs-6">
                                <h2>À quelle heure ?</h2>
                                <TimeSelect onTimeSlotChange={this.handleTimeSlotSelectedChange} timetable={business.timetable} daySelected={this.state.daySelected} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <h2>Vos informations</h2>
                                <form role="form" className="claim">
                                    {timeslotNode}
                                    <Input className="radio">
                                        <label className="radio-inline">
                                          <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
                                          Homme
                                        </label>
                                        <label className="radio-inline">
                                          <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                                          Femme
                                        </label>
                                    </Input>
                                    <Input ref="userFirstName" type="text"  placeholder="Prénom *" required />
                                    <Input ref="userLastName" type="text" placeholder="Nom *" />
                                    <Input ref="userEmail" type="email" placeholder="Email *" />
                                    <Input ref="userPhoneNumber" type="text" placeholder="Numéro de téléphone *" />
                                    <Input ref="userComment" type="text" placeholder="Prestation souhaitée. Ex: Shampoing Coupe Brushing *" />
                                    <Button className="btn-red btn-block" onClick={this.submit}>Réserver</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    handleGenderChanged: function (e) {
        this.setState({
            userGender: e.currentTarget.value
        });
    },
    handleDaySelectedChange: function(m) {
        this.setState({daySelected: m, timeslot: null});
    },
    handleTimeSlotSelectedChange: function(timeslot, discount) {
        this.setState({timeslot: timeslot, discount: discount});
    },
    submit: function (e) {
        e.preventDefault();

        this.executeAction(BookingActions.Save, {
            booking: {
                businessId  : this.state.business.id,
                gender      : this.state.userGender,
                firstName   : this.refs.userFirstName.getValue(),
                lastName    : this.refs.userLastName.getValue(),
                email       : this.refs.userEmail.getValue(),
                phoneNumber : this.refs.userPhoneNumber.getValue(),
                comment     : this.refs.userComment.getValue(),
                timeslot    : this.state.timeslot,
                discount    : this.state.discount
            }
        });
    }
});

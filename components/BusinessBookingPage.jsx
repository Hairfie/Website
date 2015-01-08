/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var moment = require('moment');

var BusinessStore = require('../stores/BusinessStore');
var BookingStore  = require('../stores/BookingStore');
var PublicLayout  = require('./PublicLayout.jsx');
var BookingCalendar = require('./Form/BookingCalendarComponent.jsx');

var UserConstants = require('../constants/UserConstants');
var BookingActions = require('../actions/Booking');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var weekDayLabelFromInt = require('../constants/DateTimeConstants').weekDayLabelFromInt;


module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, BookingStore]
    },
    getStateFromStores: function () {
        var booking  = this.getStore(BookingStore).getBooking(),
            business = this.getStore(BusinessStore).getBusiness();
        return {
            business: business,
            booking: booking
        }
    },
    getInitialState: function () {
        return this.getStateFromStores()
    },
    render: function () {
        var business = this.state.business,
            booking = this.state.booking,
            contentNode = null;

        if(booking.id) {
            contentNode = this.renderConfirmation();
        } else {
            contentNode = this.renderBookingForm();
        }

            return (
                <PublicLayout context={this.props.context}>
                    {contentNode}
                </PublicLayout>
            );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    renderConfirmation: function() {
        var booking = this.state.booking,
            business = this.state.business;
        return(
            <div className="row">
                <div className="col-sm-6 left">
                    <h1>Réservation chez {business.name} confirmée</h1>
                    <h4>ID de réservation : {booking.id}</h4>
                </div>
                <div className="col-sm-6 right">
                </div>
            </div>
        );
    },
    renderBookingForm: function() {
        var business = this.state.business;
        var timeSelectNode = null;
        if(this.state.daySelected) {
            timeSelectNode = (
                <div>
                    <h4>Vous souhaitez réserver le {weekDayLabelFromInt(this.state.daySelected.day())} {this.state.daySelected.format("D/M/YYYY")}</h4>
                    <div>

                    </div>
                </div>
            );
        }
        return (
            <div className="row">
                <div className="col-sm-6 left">
                    <div>
                        <h1>{business.name}</h1>
                    </div>
                    <BookingCalendar onDayChange={this.handleDaySelectedChange} timetable={business.timetable} />
                    {timeSelectNode}
                </div>
                <div className="col-sm-6 right">
                    <form role="form" className="claim">
                        <Input className="radio">
                            <label className="radio-inline">
                              <input type="radio" name="gender" ref="userGender" value={UserConstants.Genders.MALE} />
                              Homme
                            </label>
                            <label className="radio-inline">
                              <input type="radio" name="gender" ref="userGender" value={UserConstants.Genders.FEMALE} />
                              Femme
                            </label>
                        </Input>
                        <Input ref="userFirstName" type="text"  placeholder="Prénom" />
                        <Input ref="userLastName" type="text" placeholder="Nom" />
                        <Input ref="userEmail" type="email" placeholder="Email" />
                        <Input ref="userPhoneNumber" type="text" placeholder="Numéro de téléphone" />
                        <Input ref="userComment" type="text" placeholder="Prestation souhaitée" />
                        <Button className="btn-red btn-block" onClick={this.submit}>Réserver</Button>
                    </form>
                </div>
            </div>
        );
    },
    handleDaySelectedChange: function(m) {
        this.setState({daySelected: m});
    },
    submit: function (e) {
        e.preventDefault();
        this.props.context.executeAction(BookingActions.Save, {
            booking: {
                businessId  : this.state.business.id,
                gender      : this.refs.userGender.getDOMNode().value,
                firstName   : this.refs.userFirstName.getValue(),
                lastName    : this.refs.userLastName.getValue(),
                email       : this.refs.userEmail.getValue(),
                phoneNumber : this.refs.userPhoneNumber.getValue(),
                comment     : this.refs.userComment.getValue()
            }
        });
    }
});
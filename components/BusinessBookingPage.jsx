/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var moment = require('moment');
var _ = require('lodash');

var BusinessStore = require('../stores/BusinessStore');
var BookingStore  = require('../stores/BookingStore');
var PublicLayout  = require('./PublicLayout.jsx');
var BookingCalendar = require('./Form/BookingCalendarComponent.jsx');

var UserConstants = require('../constants/UserConstants');
var BookingActions = require('../actions/Booking');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Panel = require('react-bootstrap/Panel');
var PanelGroup = require('react-bootstrap/PanelGroup');

var DateTimeConstants = require('../constants/DateTimeConstants');
var weekDayLabelFromInt = DateTimeConstants.weekDayLabelFromInt;
var weekDaysNumber = DateTimeConstants.weekDaysNumber;

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
                <PublicLayout context={this.props.context} customClass={'booking'}>
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
                    <div className="business">
                        <div className="col-sm-4 picture">
                            <img src={business.pictures[0].url + '?height=300&width=160'} className="img-responsive" />
                        </div>
                        <div className="col-sm-8">
                            <h2>{business.name}</h2>
                            <span className="address">
                                {business.address.street} <br />
                                {business.address.zipCode} {business.address.city}
                            </span>
                        </div>
                    </div>
                    <hr />
                </div>
                <div className="col-sm-6 right">
                    <div className="confirmation">
                        <h3>Demande de réservation confirmée</h3>
                        <dl className="dl-horizontal">
                            <dt>Date & Horaire :</dt>
                            <dd>{moment(booking.timeslot).format("D/MM/YYYY [à] HH:mm")}</dd>
                            <dt>Nom :</dt>
                            <dd>{booking.firstName} {booking.lastName}</dd>
                            <dt>Email :</dt>
                            <dd>{booking.email}</dd>
                            <dt>Numéro de téléphone :</dt>
                            <dd>{booking.phoneNumber}</dd>
                            <dt>Prestation :</dt>
                            <dd>{booking.comment}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        );
    },
    renderBookingForm: function() {
        var business = this.state.business;
        var timeSelectNode = this.renderTimeSelect();
        var timeslotNode = null;

        var daySelectHeader, timeSelectHeader;

        if(this.state.daySelected) {
            daySelectHeader = weekDayLabelFromInt(this.state.daySelected.day()) + ' ' + this.state.daySelected.format("D/MM/YYYY");
            if(this.state.timeslot) {
                timeSelectHeader = this.state.timeslot.format("HH:mm")
            } else {
                timeSelectHeader = 'Choisir une heure'
            }
        } else {
            daySelectHeader = 'Choisir un jour';
            timeSelectHeader = 'Choisir une heure'
        }

        if(this.state.timeslot) {
            timeslotNode = (
                <Input type="text"  value={this.state.timeslot.format("[Demande pour le] D/MM/YYYY [à] HH:mm")} disabled />
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
            <div className="row">
                <div className="col-sm-12">
                    <h3>Votre Demande de réservation</h3>
                </div>
                <div className="col-sm-6 left">
                    <div className="business">
                        <div className="col-sm-4 picture">
                            <img src={business.pictures[0].url + '?height=300&width=160'} className="img-responsive" />
                        </div>
                        <div className="col-sm-8">
                            <h2>{business.name}</h2>
                            <span className="address">
                                {business.address.street} <br />
                                {business.address.zipCode} {business.address.city}
                            </span>
                        </div>
                    </div>
                    <hr />
                </div>
                <div className="col-sm-6 right">
                    <PanelGroup activeKey={this.state.activeKey ? this.state.activeKey : '1'} onSelect={this.handleSelect.bind(this)} accordion>
                        <Panel header={daySelectHeader} eventKey='1'>
                            <BookingCalendar onDayChange={this.handleDaySelectedChange} timetable={business.timetable} />
                        </Panel>
                        <Panel header={timeSelectHeader} eventKey='2'>
                            {timeSelectNode}
                        </Panel>
                        <Panel header="Précisez votre demande" eventKey='3'>
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
                                <Input ref="userFirstName" type="text"  placeholder="Prénom" />
                                <Input ref="userLastName" type="text" placeholder="Nom" />
                                <Input ref="userEmail" type="email" placeholder="Email" />
                                <Input ref="userPhoneNumber" type="text" placeholder="Numéro de téléphone" />
                                <Input ref="userComment" type="text" placeholder="Prestation souhaitée. Ex: Shampoing Coupe Brushing" />
                                <Button className="btn-red btn-block" onClick={this.submit}>Envoyer une demande</Button>
                            </form>
                        </Panel>
                    </PanelGroup>
                </div>
            </div>
        );
    },
    handleGenderChanged: function (e) {
        this.setState({
            userGender: e.currentTarget.value
        });
    },
    handleSelect: function(selectedKey) {
        this.setState({activeKey: selectedKey});
    },
    handleDaySelectedChange: function(m) {
        this.setState({daySelected: m, activeKey: '2'});
    },
    renderTimeSelect: function() {
        if(!this.state.daySelected) {
            return null;
        }
        var daySelected = this.state.daySelected,
            timetable = this.state.business.timetable,
            timetableSelected = timetable[weekDaysNumber[daySelected.day()]],
            hours = [];

        timetableSelected.forEach(function(slot){
            var start = moment(daySelected).hours(slot.startTime.split(":")[0]).minutes(slot.startTime.split(":")[1]),
                stop  = moment(daySelected).hours(slot.endTime.split(":")[0]).minutes(slot.endTime.split(":")[1]).add(-1, 'hour');

            moment().range(start, stop).by('hours', function(hour) {
                hours.push(hour);
            });
        });

        return (
            <div className="timeselect">
                <h4>Horaires pour le {weekDayLabelFromInt(daySelected.day())} {daySelected.format("D/MM/YYYY")}</h4>
                <div>
                    { _.map(hours, this.renderTimeButton, this) }
                </div>
            </div>
        );

    },
    renderTimeButton: function(timeslot) {
        var cls = 'btn timeslot';
            cls += timeslot.isSame(this.state.timeslot) ? ' selected' : '';
        return (
            <Button className={cls} onClick={this.handleTimeSlotChange.bind(this, timeslot)}>
                {timeslot.format("HH:mm")}
            </Button>
        );
    },
    handleTimeSlotChange: function(timeslot) {
        this.setState({timeslot: timeslot, activeKey: '3'});
    },
    submit: function (e) {
        e.preventDefault();
        this.props.context.executeAction(BookingActions.Save, {
            booking: {
                businessId  : this.state.business.id,
                gender      : this.state.userGender,
                firstName   : this.refs.userFirstName.getValue(),
                lastName    : this.refs.userLastName.getValue(),
                email       : this.refs.userEmail.getValue(),
                phoneNumber : this.refs.userPhoneNumber.getValue(),
                comment     : this.refs.userComment.getValue(),
                timeslot    : this.state.timeslot
            }
        });
    }
});
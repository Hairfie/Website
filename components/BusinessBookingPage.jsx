/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible').StoreMixin;
var moment = require('moment');
var _ = require('lodash');

var BusinessStore = require('../stores/BusinessStore');
var BookingStore  = require('../stores/BookingStore');
var PublicLayout  = require('./PublicLayout.jsx');
var BookingCalendar = require('./Form/BookingCalendarComponent.jsx');

var NavLink = require('flux-router-component').NavLink;

var UserConstants = require('../constants/UserConstants');
var BookingActions = require('../actions/Booking');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Panel = require('react-bootstrap/Panel');
var PanelGroup = require('react-bootstrap/PanelGroup');

var DateTimeConstants = require('../constants/DateTimeConstants');
var weekDayLabelFromInt = DateTimeConstants.weekDayLabelFromInt;
var weekDaysNumber = DateTimeConstants.weekDaysNumber;
var weekDayLabel = DateTimeConstants.weekDayLabel;

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, BookingStore]
    },
    getStateFromStores: function () {
        return {
            business    : this.getStore(BusinessStore).getById(this.props.route.params.businessId),
            discountObj : this.getStore(BusinessStore).getDiscountForBusiness(this.props.route.params.businessId)
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
            </PublicLayout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    renderBookingForm: function() {
        var business = this.state.business,
            timeSelectNode = this.renderTimeSelect(),
            context = this.props.context,
            timeslotNode = null,
            daySelectHeader,
            timeSelectHeader;

        if(this.state.daySelected) {
            daySelectHeader = weekDayLabelFromInt(this.state.daySelected.day()) + ' ' + this.state.daySelected.format("D/MM/YYYY");
            if(this.state.timeslot) {
                timeSelectHeader = this.state.timeslot.format("HH:mm")
                if(this.state.discount) timeSelectHeader += ' avec ' + this.state.discount + '% de réduction';
            } else {
                timeSelectHeader = 'Choisir une heure'
            }
        } else {
            daySelectHeader = 'Choisir un jour';
            timeSelectHeader = 'Choisir une heure'
        }

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
            <div className="row">
                <div className="col-sm-6 left">
                    <div className="business">
                        <div className="col-sm-5 picture">
                            <NavLink routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}} context={context}>
                                <img src={business.pictures[0].url + '?height=300&width=300'} className="img-responsive" />
                            </NavLink>
                        </div>
                        <div className="col-sm-7">
                            <NavLink routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}} context={context}>
                                <h2>{business.name}</h2>
                            </NavLink>
                            <span className="address">
                                {business.address.street} <br />
                                {business.address.zipCode} {business.address.city}
                            </span>
                        </div>
                    </div>
                    <hr />
                    { this.renderDiscountsNode() }
                </div>
                <div className="col-sm-6 right">
                    <h3>Votre Demande de réservation</h3>
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
                                <Input ref="userFirstName" type="text"  placeholder="Prénom *" required />
                                <Input ref="userLastName" type="text" placeholder="Nom *" />
                                <Input ref="userEmail" type="email" placeholder="Email *" />
                                <Input ref="userPhoneNumber" type="text" placeholder="Numéro de téléphone *" />
                                <Input ref="userComment" type="text" placeholder="Prestation souhaitée. Ex: Shampoing Coupe Brushing *" />
                                <Button className="btn-red btn-block" onClick={this.submit}>Réserver</Button>
                            </form>
                        </Panel>
                    </PanelGroup>
                </div>
            </div>
        );
    },
    renderDiscountsNode: function() {
        var business = this.state.business,
            discounts = this.state.discountObj.discountsAvailable;

        if(discounts.length === 0) {
            return null;
        }

        return (
            <div className="discounts-container">
                { _.map(discounts, this.renderDiscountNode, this) }
                <p className="conditions">
                    * Cette offre n'est valable que pour les réservations en ligne. L'achat de produits du salon avec cette offre est exclusivement liée à une prestation.
                </p>
            </div>
        );
    },
    renderDiscountNode: function(days, amount) {
        return (
            <div className="discount">
                <h4><strong>{amount}%</strong> sur toutes les prestations et tous les achats</h4>
                <p className="discount-description">
                    Disponible {_.map(days, function(day) {
                        return weekDayLabel(day) + ' ';
                    }, this)} *
                </p>
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
            hours = [],
            discounts = [];

        timetableSelected.forEach(function(slot){
            var start = moment(daySelected).hours(slot.startTime.split(":")[0]).minutes(slot.startTime.split(":")[1]),
                stop  = moment(daySelected).hours(slot.endTime.split(":")[0]).minutes(slot.endTime.split(":")[1]).add(-1, 'hour');

            moment().range(start, stop).by('hours', function(hour) {
                hours.push({hour: hour, discount: slot.discount});
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
    renderTimeButton: function(timeBtnObj) {
        var timeslot = timeBtnObj.hour,
            discount = timeBtnObj.discount,
            label = timeslot.format("HH:mm");
        var cls = 'btn timeslot';
            cls += timeslot.isSame(this.state.timeslot) ? ' selected' : '';
        if(discount) {
            cls += ' discount';
            label += '<span>(-' + discount + '%)</span>';
        }
        return (
            <Button className={cls} onClick={this.handleTimeSlotChange.bind(this, timeslot, discount)} dangerouslySetInnerHTML={{__html: label }}>
            </Button>
        );
    },
    handleTimeSlotChange: function(timeslot, discount) {
        this.setState({timeslot: timeslot, discount: discount, activeKey: '3'});
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
                timeslot    : this.state.timeslot,
                discount    : this.state.discount
            }
        });
    }
});

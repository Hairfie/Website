/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
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
var orderWeekDays = DateTimeConstants.orderWeekDays;

var Picture = require('./Partial/Picture.jsx');
var SearchUtils = require('../lib/search-utils');

var LeftColumn = React.createClass({
    render: function () {
        var business = this.props.business;
        var displayAddress = business.address ? business.address.street + ' ' + business.address.city : null;

        return (
            <div className="sidebar col-sm-3">
                <div className="salon-bloc">
                    <NavLink routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}} context={this.props.context}>
                        <Picture picture={business.pictures[0]}
                           width={220}
                          height={220} />
                    </NavLink>
                    <div className="address-bloc">
                        <h2><a href="#">{business.name}</a></h2>
                        <a href="#" className="address">{displayAddress}</a>
                    </div>
                </div>
                {this.renderDiscountsNode()}
                <div>
                    {this.renderDiscountsConditions()}
                    <div>
                        <h3>Réserver en ligne na que des avantages </h3>
                        <ul>
                            <li>- Rapide</li>
                            <li>- Gratuit</li>
                            <li>- Pratique</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    renderDiscountsNode: function() {
        var business = this.props.business,
            discounts = this.props.discountObj.discountsAvailable;

        if(discounts.length === 0) {
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
            <p>
                {amount}% sur toutes les prestations et tous les achats.
                Disponible {_.map(orderWeekDays(days), weekDayLabel, this).join(' ')}.
            </p>
        );
    },
    renderDiscountsConditions: function() {
        if(this.props.discountObj.discountsAvailable.length > 0) {
            return (<p>* Cette offre nest valable que pour les réservations en ligne. Lachat de produits du salon avec cette offre est exclusivement liée à une prestation.</p>);
        }
    }
});

var Breadcrumb = React.createClass({
    render: function () {
        var crumbs = [];
        var business = this.props.business;
        var place  = business.address.city + ', France';
        console.log('Place', place);

        crumbs = [
            {
                last: false,
                label: 'Accueil',
                routeName: 'home',
                navParams: {}
            },
            {
                last: false,
                label: 'Coiffeurs ' + business.address.city,
                routeName: 'business_search_results',
                navParams: {
                    address: SearchUtils.addressToUrlParameter(place)
                }
            },
            {
                last: false,
                label: business.name,
                routeName: 'show_business',
                navParams: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            },
            {
                last: true,
                label: 'Réservation',
                routeName: 'book_business',
                navParams: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            }
        ];

        return (
            <div className="col-xs-12">
                <ol className="breadcrumb">
                    {_.map(crumbs, function (crumb) {
                        if (crumb.last) {
                            return (
                                <li className="active">
                                    {crumb.label}
                                </li>
                            );
                        } else {
                            return (
                                <li>
                                    <NavLink context={this.props.context} routeName={crumb.routeName} navParams={crumb.navParams}>
                                        {crumb.label}
                                    </NavLink>
                                </li>
                            );
                        }
                    }, this)}
                </ol>
            </div>
        );
    }
});

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
            <div className="container reservation" id="content" >
                <div className="row">
                    <Breadcrumb context={this.props.context} business={this.state.business} />
                    <LeftColumn context={this.props.context} business={this.state.business} discountObj={this.state.discountObj} />
                    <div className="main-content col-sm-8">
                        <h3>Demande de réservation</h3>
                        <div className="row">
                            <div className="col-xs-6">
                                <h2>Choisissez votre date</h2>
                                <BookingCalendar onDayChange={this.handleDaySelectedChange} timetable={business.timetable} />
                            </div>
                            <div className="col-xs-6">
                                <h2>À quelle heure ?</h2>
                                {timeSelectNode}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
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

         _.forEach(timetableSelected, function(slot) {
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

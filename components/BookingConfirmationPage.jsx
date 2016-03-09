'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');
var PublicLayout  = require('./PublicLayout.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var ga = require('../services/analytics');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var BookingActions = require('../actions/BookingActions');
var AuthActions = require('../actions/AuthActions');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');
var BookingStatus = require('../constants/BookingConstants').Status;
var AddToCalendarButton = require('./Partial/AddToCalendarButton.jsx');
var BookingSummary = require('./BookingPage/BookingSummary.jsx');
var Breadcrumb = require('./Partial/Breadcrumb.jsx');


var BookingConfirmationPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        var booking  = this.props.booking;
        var business = booking.business;
        var address  = business.address;
        return (
            <PublicLayout context={this.props.context} customClass="booking confirmation bg-white">
                <div className="container reservation confirmation" id="content" >
                    <Breadcrumb business={business} />
                    <BookingSummary 
                        business={business} 
                        booking={booking} 
                        cancelled={this.cancelled}/>
                    <div className="row">
                        <div className="main-content col-sm-8">
                            {this.renderVerif(booking)}
                            {/*this.renderInfoFrame(booking, business, address)*/}
                        </div>
                        {this.renderRegistration()}                          
                    </div>
                </div>
            </PublicLayout>
        );
    },
    componentDidMount: function() {
        if(this.props.booking && typeof heap !== "undefined") {
            heap.identify({email: this.props.booking.email});
        }
    },
    renderVerif: function(booking) {
        var status = this.bookingStatusMessage(booking);
        return (
            <div className="legend conf">
                <h3 className={status.color}>{status.title}</h3>
                {status.content}
            </div>
        );
    },
    renderInfoFrame: function(booking, business, address) {
        if (booking.status == BookingStatus.NOT_CONFIRMED) return;
        return (
            <div>
                {this.renderRegistration(booking)}
                <div className="infoFrame col-xs-12">
                    {this.renderBookingInfo(booking)}
                    {this.renderBusinessInfo(business, address)}
                </div>
                
                {this.renderCancelButton(booking)}
                {this.renderCalendarButton(booking, business, address)}
            </div>
        );
    },
    renderCancelButton: function(booking) {
        if(booking.status == BookingStatus.REQUEST || booking.status == BookingStatus.IN_PROCESS || booking.status == BookingStatus.CONFIRMED) {
            return (<a role="button" className="btn-whitered col-xs-5" onClick={this.cancelled}>Je veux annuler mon RDV</a>);
        } else {
            return;
        }
    },
    renderCalendarButton: function(booking, business, address) {
        if(booking.status == BookingStatus.CANCELLED || booking.status == BookingStatus.HONORED) return;

        return (
            <AddToCalendarButton
                    className="btn-blue black col-xs-5 pull-right"
                    eventTitle={"Hairfie : votre RDV chez " + business.name}
                    description={"RDV au " + address.street + ' ' + address.zipCode + ' ' + address.city + " le " + moment(booking.timeslot).format("dddd D MMMM YYYY [à] HH:mm")}
                    date={booking.timeslot}
                    duration={60}
                    address={address.street + ' ' + address.zipCode + ' ' + address.city}>
                    + Ajouter à mon calendrier
                </AddToCalendarButton>
        );
    },
    renderBookingInfo: function(booking) {
        var discount;
        var status = this.bookingStatusMessage(booking);
        var title = <h4 className={status.color}>{status.title}</h4>;
        if (booking.discount)
            discount = <li>Avec {'-' + booking.discount + '% sur toutes les prestations'}</li>;
        return (
            <div className="col-xs-8 separate">
                {title}
                <ul>
                    <li>Le {moment(booking.timeslot).format("dddd D MMMM YYYY [à] HH:mm")}</li>
                    <li>{booking.service}</li>
                    {booking.comment ? <li>{booking.comment}</li> : ""}
                    {discount}
                </ul>
            </div>
        );
    },
    renderBusinessInfo: function(business, address) {
        return (
            <div className="col-xs-4 separate">
                <div>
                    <h5>{business.name}</h5>
                    <p>{address.street} {address.zipCode} {address.city}</p>
                    <a href={"tel:" + business.phoneNumber}>{business.phoneNumber}</a>
                </div>
                <Link route="business" className="btn btn-red businessButton" params={{ businessId: business.id, businessSlug: business.slug }}>+ d'infos</Link>
                <Link route="business_hairfies" className="btn btn-red pull-right businessButton" params={{ businessId: business.id, businessSlug: business.slug }}>Hairfies</Link>
            </div>
        );
    },
    renderRegistration: function() {
        if (!this.props.currentUser && this.props.booking.status != BookingStatus.NOT_CONFIRMED)
            return (
                <div className="col-xs-12 registration">
                    <h4 className="orang">Finalisez votre inscription sur Hairfie. Choisissez un mot de passe</h4>
                    <Input type="password" ref="password" placeholder="Mot de passe" className="registration"/>
                    <div>
                    <button onClick={this.handleRegisterClick} className="btn-red">Valider</button>
                    </div>
                </div>
            );
    },
    cancelled: function (e) {
        e.preventDefault();

        if(confirm('Êtes-vous certain de vouloir annuler votre RDV ?')) {
            this.context.executeAction(BookingActions.cancelBooking, {
                bookingId: this.props.booking.id,
                newsletter: this.props.booking.newsletter
            });
        };
    },
    handleRegisterClick: function(e) {
        e.preventDefault();

        var userInfo = {
            email: this.props.booking.email,
            firstName: this.props.booking.firstName,
            lastName: this.props.booking.lastName,
            password: this.refs.password.getValue(),
            gender: this.props.booking.gender,
            newsletter: this.props.booking.newsletter,
            phoneNumber: this.props.booking.phoneNumber,
            withNavigate: false
        };
        this.context.executeAction(AuthActions.register, userInfo);
    },
    handleSubmitCodeClick: function (e) {
        e.preventDefault();

        this.context.executeAction(BookingActions.submitBookingCheckCode, {
            bookingId: this.props.booking.id,
            checkCode: this.refs.checkCode.getValue(),
            newsletter: this.props.booking.newsletter
        });
    },
    bookingStatusMessage: function(booking) {
        var title, content, color;
        switch (booking.status) {
            case BookingStatus.CONFIRMED:
                title = 'Votre RDV est confirmé';
                color = 'green';
                content = (
                    <p>
                        {"Félicitations ! Vous allez chez " + this.props.booking.business.name + " qui a bien confirmé votre RDV."}
                    </p>
                );
                break;
            case BookingStatus.NOT_CONFIRMED :
                title = 'En attente de confirmation de votre numéro';
                color = 'orange';
                content = (
                    <div>
                        <p>
                            Votre demande a bien été prise en compte,
                            cependant, par mesure de sécurité,
                            nous allons vérifier vos coordonnées en vous envoyant un code par sms
                            que vous devrez entrer dans le petit formulaire ci-dessous.
                        </p>
                        <Input ref="checkCode" type="text" placeholder="Code SMS" />
                        <br />
                        <Button className='btn btn-red' onClick={this.handleSubmitCodeClick}>Soumettre</Button>
                    </div>
                );
                break;
            case BookingStatus.REQUEST :
                title = 'Demande de RDV enregistrée';
                color = 'green';
                content = (
                    <div>
                        <p>
                            Votre demande de RDV a bien été bien prise en compte. Nous transmettons cette demande au salon et vous confirmerons sa disponibilité dans les plus brefs délais.
                        </p>
                        <p>
                            En cas d'insdisponibilité, nous vous proposerons d'autres créneaux par email et SMS.
                        </p>
                    </div>
                );
                break;
            case BookingStatus.IN_PROCESS :
                title = 'Demande de RDV en cours de traitement';
                color = 'green';
                content = (
                    <p>
                        Votre demande a bien été transmise au salon. Nous attendons actuellement la confirmation de sa disponibilité sur ce créneaux. Vous recevrez une confirmation par email dans les plus brefs délais !
                    </p>
                );
                break;
            case BookingStatus.CANCEL_REQUEST :
                title = "Demande d'annulation bien prise en compte";
                color = 'orange';
                content = (
                    <p>
                        Nous avons bien pris en compte votre demande d'annulation. Elle sera transmise au salon dans les plus brefs délais. N'hésitez pas à prendre RDV pour une date ultérieure !
                    </p>
                );
                break;
            case BookingStatus.CANCELLED :
                title = 'Votre RDV est annulé';
                color = 'red';
                content = '';
                break;
            case BookingStatus.HONORED :
                title = 'Votre RDV a bien eu lieu';
                color = 'green';
                content = '';
                break;
        }

        return {
            title: title,
            content: content,
            color: color
        };
    }
});


BookingConfirmationPage = connectToStores(BookingConfirmationPage, [
    'BookingStore',
    'AuthStore',
    'UserStore'
], function (context, props) {
    var token = context.getStore('AuthStore').getToken();
    return {
        booking: context.getStore('BookingStore').getById(props.route.params.bookingId),
        currentUser: context.getStore('UserStore').getById(token.userId)
    };
});

module.exports = BookingConfirmationPage;

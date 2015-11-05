'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');
var PublicLayout  = require('./PublicLayout.jsx');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
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


var BookingConfirmationPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        var booking  = this.props.booking;
        var business = booking.business;
        var address  = business.address;
        return (
            <PublicLayout context={this.props.context} customClass="booking confirmation">
                <div className="container reservation confirmation" id="content" >
                    <div className="row">
                        <div className="main-content col-md-9 col-sm-12 pull-right">
                            {this.renderVerif(booking)}
                            {this.renderInfoFrame(booking, business, address)}
                        </div>
                        <LeftColumn context={this.props.context} business={business} />
                    </div>
                </div>
                <div className="row" />
            </PublicLayout>
        );
    },
    componentDidMount: function() {
        if(this.props.booking && typeof heap !== "undefined") {
            heap.identify({email: this.props.booking.email});
        }
    },
    renderVerif: function(booking) {
        if (booking.status == BookingStatus.REQUEST) {
            return (
                <div className="legend conf">
                    <h3 className="green">Réservation enregistrée !</h3>
                    <p>
                        Votre réservation a bien été bien prise en compte,
                        vous allez recevoir un email dans quelques instants vous confirmant votre demande.
                        En attendant, n'hésitez pas à télécharger l'application Hairfie ou
                        à aller vous inspirer en regardant les Hairfies déjà postés par votre salon.
                    </p>
                </div>
            );
        } else if (booking.status == BookingStatus.NOT_CONFIRMED) {
            return (
                <div className="legend conf">
                    <h3 className="orange">Demande de vérification !</h3>
                    <p>
                        Votre demande a bien été prise en compte,
                        cependant, par mesure de sécurité,
                        nous allons vérifier vos coordonnées en vous envoyant un code par sms
                        que vous devrez entrer dans le petit formulaire ci-dessous.
                    </p>
                    <Input ref="checkCode" type="text" placeholder="Code SMS" />
                    <br />
                    <Button onClick={this.handleSubmitCodeClick}>Soumettre</Button>
                </div>
            );
        } else if (booking.status == BookingStatus.CANCELLED)
            return (
                <div className="legend conf">
                    <h3 className="green">Réservation annulé</h3>
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
                <a role="button" className="btn-white red col-xs-5" onClick={this.cancelled}>Annuler</a>
                <AddToCalendarButton
                    className="btn-blue black col-xs-5 pull-right"
                    eventTitle="Hairfie: Réservation"
                    description={"Réservation au " + address.street + ' ' + address.zipCode + ' ' + address.city + " le " + moment(booking.timeslot).format("dddd D MMMM YYYY [à] HH:mm")}
                    date={booking.timeslot}
                    duration={60}
                    address={address.street + ' ' + address.zipCode + ' ' + address.city}>
                    + Ajouter à mon calendrier
                </AddToCalendarButton>
            </div>
        );
    },
    renderBookingInfo: function(booking) {
        var discount;
        var status = <h4 className="green">Réservation Confirmée</h4>;
        if (booking.status == BookingStatus.CANCELLED)
            status = <h4 className="red">Réservation Annulée</h4>
        if (booking.discount)
            discount = <li>Avec -{booking.discount} % sur toute la carte</li>;
        return (
            <div className="col-xs-8 separate">
                {status}
                <ul>
                    <li>Le {moment(booking.timeslot).format("dddd D MMMM YYYY [à] HH:mm")}</li>
                    <li>{booking.comment}</li>
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
                <Link route="business_hairfies" className="btn btn-red pull-right businessButton" params={{ businessId: business.id, businessSlug: business.slug }}>Ses Hairfies</Link>
            </div>
        );
    },
    renderDiscount: function(booking) {
        if (!booking.discount) return;

        return (
            <div>
                <dt>Votre promotion :</dt>
                <dd>-{booking.discount} % sur toute la carte</dd>
            </div>
        );
    },
    renderRegistration: function() {
        if (!this.props.currentUser)
            return (
                <div>
                    <h3 className="orange">Complétez votre inscription</h3>
                    <Input type="password" ref="password" placeholder="Choisissez un mot de passe" className="registration"/>
                    <Button onClick={this.handleRegisterClick} className="btn-red pull-right col-xs-4">S'inscrire</Button>
                </div>
            );
    },
    cancelled: function (e) {
        e.preventDefault();

        this.context.executeAction(BookingActions.cancelBooking, {
            bookingId: this.props.booking.id,
            newsletter: this.props.booking.newsletter
        });
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

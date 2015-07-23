'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');
var PublicLayout  = require('./PublicLayout.jsx');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
var connectToStores = require('../lib/connectToStores');
var ga = require('../services/analytics');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var BookingActions = require('../actions/BookingActions');
var AuthActions = require('../actions/AuthActions');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');
var BookingStatus = require('../constants/BookingConstants').Status;

var BookingConfirmationPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        if(_.isUndefined(this.props.booking)) {
            return (
                <PublicLayout customClass="booking confirmation">
                    <div className="loading" />
                </PublicLayout>
            )
        } else {
            var booking  = this.props.booking;
            var business = booking.business;
            var address  = business.address;
            return (
                <PublicLayout context={this.props.context} customClass="booking confirmation">
                    <div className="container reservation confirmation" id="content" >
                        <div className="row">
                            <div className="main-content col-md-9 col-sm-12 pull-right">
                                {this.renderVerif(booking)}
                                {this.renderRegistration(booking)}
                                <div className="infoFrame">
                                    {this.renderBookingInfo(booking)}
                                    {this.renderBusinessInfo(business, address)}
                                </div>
                                {this.renderButtons()}
                                {/*<a href="https://itunes.apple.com/fr/app/hairfie/id853590611?mt=8" className="pull-right" target="_blank" >Télécharger l'application</a>
                                <div className="clearfix"></div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-6">
                                        <h3>Votre demande</h3>
                                        <dl className="dl-horizontal">
                                            <dt>Date :</dt>
                                            <dd>{moment(booking.timeslot).format("dddd D MMMM YYYY [à] HH:mm")}</dd>
                                            <dt>Horaire :</dt>
                                            <dd>{moment(booking.timeslot).format("HH:mm")}</dd>
                                            {this.renderDiscount(booking)}
                                            <dt>Note :</dt>
                                            <dd>{booking.comment}</dd>
                                            <dt>Nom du salon :</dt>
                                            <dd>{business.name}</dd>
                                            <dt>Adresse :</dt>
                                            <dd>{address.street} {address.zipCode} {address.city}</dd>
                                            <dt>Téléphone :</dt>
                                            <dd>{business.phoneNumber}</dd>
                                        </dl>
                                    </div>
                                    <div className="col-sm-6">
                                        <h3>Vos coordonnées</h3>
                                        <dl className="dl-horizontal">
                                            <dt>Votre Nom :</dt>
                                            <dd>{booking.firstName} {booking.lastName}</dd>
                                            <dt>Votre Email :</dt>
                                            <dd>{booking.email}</dd>
                                            <dt>Numéro de téléphone :</dt>
                                            <dd>{booking.phoneNumber}</dd>
                                        </dl>
                                    </div>
                                </div>*/}
                            </div>
                            <LeftColumn context={this.props.context} business={business} />
                        </div>
                    </div>
                    <div className="row" />
                </PublicLayout>
            );
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
                        à aller vous inspirez en regardant les Hairfies déjà postés par votre salon.
                    </p>
                </div>
            );
        } else {
            return (
                <div className="legend conf">
                    <h3 className="green">Demande de vérification !</h3>
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
        }
    },
    renderBookingInfo: function(booking) {
        var discount;
        var status = <p className="green">Réservation Confirmée</p>;
        if (booking.status == BookingStatus.NOT_CONFIRMED)
            status = <p className="orange">Vérification sms</p>
        if (booking.status == BookingStatus.CANCELLED)
            status = <p className="red">Réservation annulée</p>
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
                    <p>{business.name}</p>
                    {address.street} {address.zipCode} {address.city}
                    <br />
                    <a href={"tel:" + business.phoneNumber}>{business.phoneNumber}</a>
                </div>
                <Link route="business" className="btn btn-red" params={{ businessId: business.id, businessSlug: business.slug }}>+ d'infos</Link>
                <Link route="business_hairfies" className="btn btn-red" params={{ businessId: business.id, businessSlug: business.slug }}>Ses Hairfies</Link>
            </div>
        );
    },
    renderButtons: function() {
        return (
            <div className="buttonPanel">
                <a role="button" className="btn-white red" onClick={this.cancelled}>Annuler</a>
                <a role="button" className="btn-blue">Ajouter à mon calendrier</a>
                <a href="https://itunes.apple.com/fr/app/hairfie/id853590611?mt=8" target="_blank" >
                    <Picture picture={{url: '/images/btn-app-dl.png'}} height='50px' />
                </a>
                <Link route="home" className="btn-green">
                    Retour à l'accueil
                </Link>
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
                    <Input type="password" ref="password" placeholder="Choisissez un mot de passe"/>
                    <Button onClick={this.handleRegisterClick} className="btn-orange">S'inscrire</Button>
                </div>
            );
    },
    cancelled: function (e) {
        e.preventDefault();

        this.context.executeAction(BookingActions.cancelBooking, {
            bookingId: this.props.booking.id
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
            newsletter: false,
            phoneNumber: this.props.booking.phoneNumber,
            withNavigate: false
        };
        this.context.executeAction(AuthActions.register, userInfo);
    },
    handleSubmitCodeClick: function (e) {
        e.preventDefault();

        this.context.executeAction(BookingActions.submitBookingCheckCode, {
            bookingId: this.props.booking.id,
            checkCode: this.refs.checkCode.getValue()
        });
    }
});

BookingConfirmationPage = connectToStores(BookingConfirmationPage, [
    'BookingStore',
    'AuthStore',
    'UserStore'
], function (stores, props) {
    var token = stores.AuthStore.getToken();
    return {
        booking: stores.BookingStore.getById(props.route.params.bookingId),
        currentUser: stores.UserStore.getUserInfo(token.userId)
    };
});

module.exports = BookingConfirmationPage;

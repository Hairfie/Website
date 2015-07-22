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
                    <div className="container reservation" id="content" >
                        <div className="row">
                            <div className="main-content col-md-9 col-sm-12 pull-right">
                                {this.renderVerif(booking)}
                                {this.renderBookingInfo(booking)}
                                {this.renderBusinessInfo(business, address)}
                                {this.renderButtons()}
                                <a href="https://itunes.apple.com/fr/app/hairfie/id853590611?mt=8" className="pull-right" target="_blank" >Télécharger l'application</a>
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
                                </div>
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
            status = <p className="red">Réservation confirmée</p>
        if (booking.discount)
            discount = <li>Avec -{booking.discount} % sur toute la carte</li>;
        return (
            <div>
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
            <div>
                <p>Le coiffeur</p>
                {address.street} {address.zipCode} {address.city}
                <Picture picture={business.pictures[0]}
                           resolution={{width: 50, height: 50}}
                           placeholder="/images/placeholder-55.png" />
                <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>+ d'infos</Link>
                <Link route="business_hairfies" params={{ businessId: business.id, businessSlug: business.slug }}>Ses Hairfies</Link>
            </div>
        );
    },
    renderButtons: function() {
        if (!this.props.currentUser)
            return (
                <div>
                    <Link route="registration_page" query={{bookingId: this.props.booking.id}}>
                        Nous vous invitons également à vous inscrire
                    </Link>
                    <Link route="home">
                        Retour à l'accueil
                    </Link>
                    <a href="https://itunes.apple.com/fr/app/hairfie/id853590611?mt=8" className="pull-right" target="_blank" >Télécharger l'application</a>
                </div>
            );
        return(
            <div>
                <Link route="home">
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
    handleSubmitCodeClick: function (e) {
        e.preventDefault();

        var bookingId = this.props.booking.id;
        var checkCode = this.refs.checkCode.getValue();

        this.context.executeAction(BookingActions.submitBookingCheckCode, {
            bookingId: bookingId,
            checkCode: checkCode
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

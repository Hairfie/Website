'use strict';

var React = require('react');
var moment = require('moment');
var _ = require('lodash');
var PublicLayout  = require('./PublicLayout.jsx');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
var connectToStores = require('../lib/connectToStores');

var BookingConfirmationPage = React.createClass({
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
                                <div className="legend conf">
                                    <h3 className="green"> Réservation enregistrée ! </h3>
                                    <p>
                                        Votre réservation a bien été bien prise en compte, vous allez recevoir un email dans quelques instants vous confirmant votre demande.
                                        En attendant, n'hésitez pas à télécharger l'application Hairfie ou à aller vous inspirez en regardant les Hairfies déjà postés par votre salon.
                                    </p>
                                </div>
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
    renderDiscount: function(booking) {
        if (!booking.discount) return;

        return (
            <div>
                <dt>Votre promotion :</dt>
                <dd>-{booking.discount} % sur toute la carte</dd>
            </div>
        );
    }
});

BookingConfirmationPage = connectToStores(BookingConfirmationPage, [
    'BookingStore'
], function (stores, props) {
    return {
        booking: stores.BookingStore.getById(props.route.params.bookingId)
    };
});

module.exports = BookingConfirmationPage;

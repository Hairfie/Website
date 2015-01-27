/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible').StoreMixin;
var moment = require('moment');
var _ = require('lodash');

var BookingStore  = require('../stores/BookingStore');
var PublicLayout  = require('./PublicLayout.jsx');

var NavLink = require('flux-router-component').NavLink;

var UserConstants = require('../constants/UserConstants');
var BookingActions = require('../actions/Booking');

var Jumbotron = require('react-bootstrap/Jumbotron');
var Button = require('react-bootstrap/Button');

var DateTimeConstants = require('../constants/DateTimeConstants');
var weekDayLabelFromInt = DateTimeConstants.weekDayLabelFromInt;
var weekDaysNumber = DateTimeConstants.weekDaysNumber;


module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BookingStore]
    },
    getStateFromStores: function () {
        return {
            booking: this.getStore(BookingStore).getById(this.props.route.params.bookingId)
        }
    },
    getInitialState: function () {
        return this.getStateFromStores()
    },
    render: function () {
        var loading  = _.isUndefined(this.state.booking),
            booking  = this.state.booking || {},
            business = booking.business || {},
            address  = business.address || {};

        return (
            <PublicLayout context={this.props.context} loading={loading} customClass="booking confirmation">
                <div className="row">
                    <Jumbotron>
                        <h2>
                            <i className="glyphicon glyphicon-ok"></i>
                            Réservation enregistrée !
                        </h2>
                        <p>
                            Votre réservation a bien été bien prise en compte, vous allez recevoir un email dans quelques instants vous confirmant votre demande.
                        </p>
                        <p>
                            En attendant, n'hésitez pas à télécharger l'application Hairfie ou à aller vous inspirez en regardant les Hairfies déjà postés par votre salon
                        </p>
                        <NavLink routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}} context={this.props.context}>
                            <Button className="btn-primary">
                                Voir les Hairfies de mon salon
                            </Button>
                        </NavLink>
                        <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank" className="btn btn-lg">
                            <img className="btn-apple" src="/img/btn-apple@2x.png" />
                        </a>
                    </Jumbotron>
                    <div className="col-sm-6">
                        <h3>Votre demande</h3>
                        <dl className="dl-horizontal">
                            <dt>Date :</dt>
                            <dd>{weekDayLabelFromInt(moment(booking.timeslot).day())} {moment(booking.timeslot).format("D/MM/YYYY")}</dd>
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
            </PublicLayout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
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

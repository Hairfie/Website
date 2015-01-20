/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
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
        var booking  = this.getStore(BookingStore).getBooking(),
            business = booking ? booking.business : null;
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
            context = this.props.context,
            discountNode = this.renderDiscount(booking);

        if(!booking) {
            return (<span>Loading in progress</span>);
        }

        return (
            <PublicLayout context={this.props.context} customClass={'booking confirmation'}>
                <div className="row">
                    <Jumbotron>
                        <h2>
                            <i className="glyphicon glyphicon-ok"></i>
                            Réservation enregistrée !
                        </h2>
                        <p>
                            Rien besoin de faire de plus, tout a été enregistré ! Vous allez recevoir un email dans quelques instants vous confirmant votre demande.
                        </p>
                        <p>
                            En attendant, n'hésitez pas à télécharger l'application Hairfie ou à aller vous inspirez en regardant les Hairfies déjà postés par votre salon
                        </p>
                        <NavLink routeName="show_business" navParams={{id: business.id, slug: business.slug}} context={this.props.context}>
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
                            {discountNode}
                            <dt>Note :</dt>
                            <dd>{booking.comment}</dd>
                            <dt>Nom du salon :</dt>
                            <dd>{business.name}</dd>
                            <dt>Adresse :</dt>
                            <dd>{business.address.street} {business.address.zipCode} {business.address.city}</dd>
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
        console.log("booking.discount", booking.discount);
        if(booking.discount) {
            return (
                <div>
                    <dt>Votre promotion :</dt>
                    <dd>-{booking.discount} % sur toute la carte</dd>
                </div>
            );
        }
    }
});
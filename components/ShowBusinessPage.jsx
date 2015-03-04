/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;

var BusinessStore = require('../stores/BusinessStore');
var BusinessServiceStore = require('../stores/BusinessServiceStore');

var PublicLayout = require('./PublicLayout.jsx');
var Map = require('./MapComponent.jsx');
var ShowHairfies = require('./ShowHairfies.jsx');
var ClaimExistingBusiness = require('./ClaimExistingBusiness.jsx');

var Navigate = require('flux-router-component/actions/navigate');

var NavLink = require('flux-router-component').NavLink;
var Button = require('react-bootstrap/Button');

var _ = require('lodash');
var weekDayLabel = require('../constants/DateTimeConstants').weekDayLabel;

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessServiceStore]
    },
    getStateFromStores: function () {
        return {
            business    : this.getStore(BusinessStore).getById(this.props.route.params.businessId),
            discountObj : this.getStore(BusinessStore).getDiscountForBusiness(this.props.route.params.businessId),
            services    : this.getStore(BusinessServiceStore).getByBusiness(this.props.route.params.businessId)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var loading  = _.isUndefined(this.state.business),
            business = this.state.business || {};

        return (
            <PublicLayout>
                <div className="row" id="business-header">
                    <div className="col-sm-3 col-xs-12 map">
                        {this.renderMap()}
                    </div>
                    <div className="col-sm-6 col-xs-6 infos">
                        <h1>{business.name}</h1>
                        <p className="info address">
                            <span className="icon icon-address"></span>
                            {this.renderAddress()}
                        </p>
                        {this.renderPhoneNode()}
                        {this.renderDiscountNode()}
                        {this.renderServicesNode()}
                        {this.renderBookingButton()}
                        <p>
                            <ClaimExistingBusiness business={business} />
                        </p>
                    </div>
                    <div className="col-sm-3 col-xs-6 pictures">
                        {this.renderPictures() }
                    </div>
                </div>
                <div className="row business-hairfies">
                    <ShowHairfies businessId={business.id} />
                </div>
            </PublicLayout>
        );
    },
    renderPictures: function () {
        var pictures = this.state.business && this.state.business.pictures;

        if (!pictures || 0 == pictures.length) return;

        return <img src={pictures[0].url + '?height=430&width=300'} className="img-rounded img-responsive"/>
    },
    renderAddress: function () {
        var address = this.state.business && this.state.business.address;

        if (!address) {
            return <p>Information non disponible.</p>;
        }

        return (
            <span className="content">
                {address.street} <br />
                {address.zipCode + ' ' + address.city}
            </span>
        );
    },
    renderMap: function () {
        var business = this.state.business,
            gps      = business && business.gps;

        if (!business) return;

        return <Map marker={{lat: gps.lat, lng: gps.lng, title: business.name}} />;
    },
    renderDiscountNode: function() {
        var business    = this.state.business,
            discountObj = this.state.discountObj;

        if (!discountObj || !discountObj.max) return;

        if(this.state.discountObj.max) {
            return (
                <p className="info discounts">
                    <span className="icon icon-discount"></span>
                    <span className="content">
                        <NavLink routeName="book_business" navParams={{businessId: business.id, businessSlug: business.slug}}>
                            <span className="label label-discount">
                                {discountObj.max} %
                            </span>
                        </NavLink>
                        <span className="legend">
                            sur toutes les prestations et tous les achats *
                        </span>
                    </span>
                </p>
            );
        } else {
            return null;
        }
    },
    renderServicesNode: function() {
        var services = this.state.services;
        if(services && services.length > 0) {
            return (
                <div className="info services">
                    <span className="icon icon-price"></span>
                    <ul className="content">
                        <li className="title">Extrait des tarifs :</li>
                        {_.map(services, this.renderServiceNode)}
                        <li>...</li>
                        <li className="clearfix" />
                    </ul>
                </div>
            );
        };
    },
    renderServiceNode: function(service) {
        return (
            <li>
                { service.label + ' : ' + service.price.amount + '€' }
            </li>
        );
    },
    renderBookingButton: function () {
        var business = this.state.business;

        if (!business || !business.isBookable) return;

        return (
            <p className="booking-container">
                <NavLink routeName="book_business" navParams={{businessId: this.state.business.id, businessSlug: this.state.business.slug}}>
                    <Button className="btn-booking">
                        Réserver
                    </Button>
                </NavLink>
            </p>
        );
    },
    renderPhoneNode: function () {
        var business = this.state.business;

        if (!business || business.isBookable) return;

        return (
            <p className="info phone">
                <span className="icon icon-phone"></span>
                <span className="content">
                    <span className="label label-red">{business.phoneNumber ? business.phoneNumber : 'Information indisponible'  }</span>
                </span>
            </p>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});

function createMap(el) {
    var options = {};
    options.zoom = 16;

    return Google
        .loadMaps()
        .then(function (google) {
            return new google.maps.Map(el, options);
        });
}

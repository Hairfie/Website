/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../../stores/BusinessStore');
var BusinessServiceStore = require('../../stores/BusinessServiceStore');
var StationStore = require('../../stores/StationStore');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var Map = require('./Map.jsx');

var dayFrenchNames = {MON: 'lundi', TUE: 'mardi', WED: 'mercredi', THU: 'jeudi', FRI: 'vendredi', SAT: 'samedi', SUN: 'dimanche'};
var dayPositions = {MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6};

function sortDays(days) {
    return _.sortBy(days, function (day) { return dayPositions[day] });
}

function frenchDay(day) {
    return dayFrenchNames[day];
}

function displayName(n) {
    return n.firstName+' '+(n.lastName || '').substr(0, 1)+'.'
}

function initials(n) {
    return (n.firstName || '').substr(0, 1)+''+(n.lastName || '').substr(0, 1)
}

var HairdresserPicture = React.createClass({
    render: function () {
        if (!this.props.hairdresser.picture) return this.renderDefault();

        return <Picture picture={this.props.hairdresser.picture}
                     resolution={{width: 120, height: 120}}
                            alt={this.getAlt()} />;
    },
    renderDefault: function () {
        return <img src={'http://placehold.it/120&text='+initials(this.props.hairdresser)} alt={this.getAlt()} />;
    },
    getAlt: function () {
        return 'Photo de '+displayName(this.props.hairdresser);
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessServiceStore, StationStore]
    },
    getStateFromStores: function (props) {
        var props = props || this.props;

        var business = this.getStore(BusinessStore).getById(props.businessId);
        var stations = business && this.getStore(StationStore).getByLocation(business.gps);

        return {
            business: business,
            services: this.getStore(BusinessServiceStore).getByBusiness(props.businessId),
            discounts: this.getStore(BusinessStore).getDiscountForBusiness(props.businessId),
            stations: _.groupBy(stations, 'type')
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFromStores(nextProps));
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        return (
            <div>
                {this.renderHairdressers()}
                {this.renderServices()}
                {this.renderDiscounts()}
                {this.renderLocation()}
                {this.renderDescription()}
            </div>
        );
    },
    renderHairdressers: function () {
        var business     = this.state.business || {};
        var hairdressers = business.activeHairdressers || [];

        if (hairdressers.length == 0) return;

        return (
            <section>
                <h3>Nos Coiffeurs</h3>
                <div className="row">
                    {_.map(hairdressers, function (hairdresser) {
                        return (
                            <div key={hairdresser.id} className="col-sm-3 col-xs-6 coiffeur">
                                <HairdresserPicture hairdresser={hairdresser} />
                                <p className="text-center">{hairdresser.firstName} {(hairdresser.lastName || '').substr(0, 1)}.</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    },
    renderServices: function () {
        var services = this.state.services || [];

        if (services.length == 0) return;

        return (
            <section>
                <h3>Nos Prix</h3>
                <div className="row table-price">
                    {_.map(services, function (service) {
                        return (
                            <div className="col-xs-6 col-sm-4">
                                <p>{service.label}:&nbsp;<span>{service.price.amount}€</span></p>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    },
    renderDiscounts: function () {
        var discounts = this.state.discounts || {};

        if (!discounts.max) return;

        return (
            <section>
                <h3>Nos Promotions</h3>
                <div className="row">
                    {_.map(discounts.discountsAvailable, function (days, percentage) {
                        return (
                            <div className="col-xs-10 col-sm-12">
                                <div className="promo">
                                    <h4>{percentage}% sur toutes les prestations et tous les achats dans le salon de coiffure</h4>
                                    <p>Cette offre n'est valable que pour les réservations en ligne. L'achat de produits du salon avec cette offre est exclusivement liée à une prestation. Le {_.map(sortDays(days), frenchDay).join(', ')}.</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    },
    renderLocation: function () {
        return (
            <section>
                <h3>Comment s'y rendre ?</h3>
                {this.renderStations()}
                {this.renderMap()}
            </section>
        );
    },
    renderStations: function () {
        var stations = this.state.stations || {};

        if (!stations.rer && !stations.metro) return;

        return (
            <div>
                <h4>RER / Métro</h4>
                <p>{_.uniq(_.map(_.flatten([stations.rer || [], stations.metro || []]), 'name')).join(', ')}</p>
            </div>
        );
    },
    renderMap: function () {
        var business = this.state.business || {};

        return <Map location={business.gps} className="map container-fluid" />;
    },
    renderDescription: function () {
        var business = this.state.business || {};
        var description = business.description;

        if (_.values(description).join('') == '') return;

        return (
            <section>
                <h3>Description du salon</h3>
                <h4>{description.geoTitle}</h4>
                <p>{description.geoText}</p>
                <h4>{description.proTitle}</h4>
                <p>{description.proText}</p>
                <h4>{description.businessTitle}</h4>
                <p>{description.businessText}</p>
            </section>
        );
    }
});

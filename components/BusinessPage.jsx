'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var Picture = require('./Partial/Picture.jsx');
var Layout = require('./BusinessPage/Layout.jsx');
var Map = require('./BusinessPage/Map.jsx');

var dayFrenchNames = {MON: 'lundi', TUE: 'mardi', WED: 'mercredi', THU: 'jeudi', FRI: 'vendredi', SAT: 'samedi', SUN: 'dimanche'};
var dayPositions = {MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6};

function sortDays(days) { return _.sortBy(days, function (day) { return dayPositions[day] }); }
function frenchDay(day) { return dayFrenchNames[day]; }
function displayName(n) { return n.firstName+' '+(n.lastName || '').substr(0, 1)+'.' }
function initials(n) { return (n.firstName || '').substr(0, 1)+''+(n.lastName || '').substr(0, 1) }

var HairdresserPicture = React.createClass({
    render: function () {
        if (!this.props.hairdresser.picture) return this.renderDefault();

        return <Picture picture={this.props.hairdresser.picture}
                     options={{
                        width: 340,
                        height: 340,
                        crop: 'thumb',
                        gravity: 'faces'
                     }}
                    placeholder="/images/placeholder-640.png"
                            alt={this.getAlt()} />;
    },
    renderDefault: function () {
        return <img src={'http://placehold.it/120&text='+initials(this.props.hairdresser)} alt={this.getAlt()} />;
    },
    getAlt: function () {
        return 'Photo de '+displayName(this.props.hairdresser);
    }
});

var BusinessPage = React.createClass({
    render: function () {
        return (
            <Layout business={this.props.business} tab="infos">
                {this.renderHairdressers()}
                {this.renderServices()}
                {this.renderDiscounts()}
                {this.renderLocation()}
                {this.renderDescription()}
            </Layout>
        );
    },
    renderHairdressers: function () {
        var business     = this.props.business || {};
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
        var services = this.props.services || [];
        var i;
        if (services.length == 0) return;
        for (i = 0; i <= services.length; i++)
        {
            if (i == services.length) return;
            if (services[i].price.amount > 0) break;
        }

        return (
            <section>
                <h3>Extrait des tarifs</h3>
                <div className="row table-price">
                    {_.map(services, function (service) {
                        if (service.price.amount == 0) return;
                        return (
                            <div key={service.id}>
                                <p>{service.label}:&nbsp;<span>{service.price.amount}€</span></p>
                            </div>
                        );
                    })}
                </div>
                <br />
                <p>Ces prix ne prennent pas en comptes des éventuelles promotions sur ces prestations</p>
            </section>
        );
    },
    renderDiscounts: function () {
        var discounts = this.props.discounts || {};

        if (!discounts.max) return;

        return (
            <section>
                <h3>Nos Promotions</h3>
                <div className="row">
                    {_.map(discounts.discountsAvailable, function (days, percentage) {
                        return (
                            <div key={percentage} className="col-xs-10 col-sm-12">
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
            <section id="location">
                <h3>Comment s'y rendre ?</h3>
                {this.renderStations()}
                {this.renderMap()}
            </section>
        );
    },
    renderStations: function () {
        var stations = _.groupBy(this.props.stations || [], 'type')

        if (!stations.rer && !stations.metro) return;

        return (
            <div>
                <h4>RER / Métro</h4>
                <p>{_.uniq(_.map(_.flatten([stations.rer || [], stations.metro || []]), 'name')).join(', ')}</p>
            </div>
        );
    },
    renderMap: function () {
        var business = this.props.business || {};

        return <Map location={business.gps} className="map container-fluid" />;
    },
    renderDescription: function () {
        var business = this.props.business || {};
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

BusinessPage = connectToStores(BusinessPage, [
    'BusinessStore',
    'BusinessServiceStore',
    'StationStore',
], function (stores, props) {
    var business = stores.BusinessStore.getById(props.route.params.businessId);

    return {
        business: business,
        services: stores.BusinessServiceStore.getByBusiness(props.route.params.businessId),
        discounts: stores.BusinessStore.getDiscountForBusiness(props.route.params.businessId),
        stations: business && stores.StationStore.getNearby(business.gps)
    };
});

module.exports = BusinessPage;

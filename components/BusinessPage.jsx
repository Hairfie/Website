'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Picture = require('./Partial/Picture.jsx');
var Layout = require('./BusinessPage/Layout.jsx');
var Map = require('./BusinessPage/Map.jsx');
var Hairdressers = require('./BusinessPage/Hairdressers.jsx');

var dayFrenchNames = {MON: 'lundi', TUE: 'mardi', WED: 'mercredi', THU: 'jeudi', FRI: 'vendredi', SAT: 'samedi', SUN: 'dimanche'};
var dayPositions = {MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6};

function sortDays(days) { return _.sortBy(days, function (day) { return dayPositions[day] }); }
function frenchDay(day) { return dayFrenchNames[day]; }

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
                    <Hairdressers hairdressers={hairdressers} />
                </div>
            </section>
        );
    },
    renderServices: function () {
        var services = this.props.services || [];

        return (
            <section>
                <h3>Extrait des tarifs</h3>
                <div className="row table-price">
                    {_.map(services, function (service) {
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
                {_.uniq(_.map(_.flatten([stations.rer || [], stations.metro || []]), function(station) {
                    return (<p>{station.name}
                        {station.type == "metro" ? <Picture picture={{url: '/img/icons/RATP/M.png'}} style={{width: 25, height: 25, marginLeft: 7}}/> : ""}
                        {_.map(station.lines, function(line) {
                            var name = "";
                            if (line.type == "metro")
                                name = "M_";
                            else if (line.type == "rer")
                                name = "RER_";
                            name += line.number.toUpperCase();
                            return (<Picture picture={{url: '/img/icons/RATP/' + name + '.png'}} style={{width: 25, height: 25, marginLeft: 7}}/>);
                        })}
                        </p>);
                }))}
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
], function (context, props) {
    var business = context.getStore('BusinessStore').getById(props.route.params.businessId);
    return {
        business: business,
        services: context.getStore('BusinessServiceStore').getByBusiness(props.route.params.businessId),
        discounts: context.getStore('BusinessStore').getDiscountForBusiness(props.route.params.businessId),
        stations: business && context.getStore('StationStore').getNearby(business.gps)
    };
});

module.exports = BusinessPage;

'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Link = require('../Link.jsx');
var Map = require('./Map.jsx');
var NavToLinkMixin = require('../mixins/NavToLink.jsx');
var SimilarBusinesses = require('./SimilarBusinesses.jsx');
var ga = require('../../services/analytics');
var businessAccountTypes = require('../../constants/BusinessAccountTypes');
var Picture = require('../Partial/Picture.jsx');
var _ = require('lodash');


var Sidebar = React.createClass({
    mixins: [NavToLinkMixin],
    getInitialState: function () {
        return {
            displayPhone: false
        };
    },
    render: function () {
        return (
            <div className="sidebar col-sm-4">
                {this.renderBookNow()}
                {this.renderBestDiscount()}
                {this.renderSimilarBusinesses()}
                {this.renderLocation()}
                {this.renderPhoneNumber()}
            </div>
        );
    },
    renderBookNow: function () {
        var business = this.props.business;
        if (!business || !business.isBookable) return;
        return (                
            <Link className="btn btn-book hidden-xs" route="business_booking" params={{ businessId: business.id, businessSlug: business.slug }}>
                Prendre RDV
            </Link>
        );
    },
    renderBestDiscount: function () {
        if (this.props.business.accountType == businessAccountTypes.FREE) return null;
        var discount = this.props.business && this.props.business.bestDiscount;

        if (!discount) return null;
        var business = this.props.business;

        return (
            <Link route="business_booking" params={{ businessId: business.id, businessSlug: business.slug }}>
                <div className="promo-sidebar">
                    <Picture picture={{url: '/img/promo-bg.jpg'}}
                        style={{width: '100%'}}
                        placeholder="/img/placeholder-640.png" />
                    <div className="inline-promo">
                        <p>
                            {discount + '%'}
                        </p>
                        <p>
                            Dans tout le salon
                        </p>
                        <Picture picture={{url: '/img/business-promo.png'}} />
                    </div>
                </div>
            </Link>
        );
    },
    renderPhoneNumber: function() {
        var business = this.props.business;
        if(business.accountType != businessAccountTypes.PREMIUM && !business.displayPhoneNumber) return null;

        var link = null;
        if (this.state.displayPhone) {
            link = (<a href={"tel:" + business.phoneNumber.replace(/ /g,"")} className="btn btn-phone">
                {business.phoneNumber}
            </a>);
        }
        else {
            link = (<a role="button" className="btn btn-phone" onClick={this.trackCall}>
                {this.state.displayPhone ? business.phoneNumber : "Afficher le numéro"}
            </a>);
        }

        return (
            <div className="phone">
                {link}
            </div>
        );
    },
    trackCall: function(e) {
        e.preventDefault();
        if(ga) {
            var eventAction = 'call';
            if(this.props.business.accountType == 'BASIC') eventAction += ' BASIC';
            if(this.props.business.accountType == 'FREE') eventAction += ' FREE';

            ga('send', {
              hitType: 'event',
              eventCategory: 'Call Booking',
              eventAction: eventAction,
              eventLabel: this.props.business.name
            });
        }
        this.setState({displayPhone: true});
    },
    renderSimilarBusinesses: function () {
        if (!this.props.business || !this.props.similarBusinesses) return null;

        if ((this.props.business.accountType == businessAccountTypes.BASIC) 
            || (this.props.business.accountType == businessAccountTypes.FREE && this.props.tab != 'infos')) {
            return <SimilarBusinesses businesses={this.props.similarBusinesses} slidebar={true} />;
        }
        return null;
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
                {_.uniq(_.map(_.flatten([stations.rer || [], stations.metro || []]), function(station, i) {
                    return (<p key={i}>
                        {station.type == "metro" ? <Picture picture={{url: '/img/icons/RATP/M.png'}} style={{width: 25, height: 25, marginRight: 7}}/> : ""}
                        {_.map(station.lines, function(line, i) {
                            var name = "";
                            if (line.type == "metro")
                                name = "M_";
                            else if (line.type == "rer")
                                name = "RER_";
                            name += line.number.toUpperCase();
                            return (<Picture picture={{url: '/img/icons/RATP/' + name + '.png'}} style={{width: 25, height: 25, marginRight: 7}} key={i} />);
                        })}
                            {station.name}
                        </p>);
                }))}
            </div>
        );
    },
    renderMap: function () {
        var business = this.props.business || {};

        return <Map location={business.gps} className="map container-fluid" />;
    },
    book: function (date) {
        var business = this.props.business || {};
        var pathParams = {businessId: business.id, businessSlug: business.slug};
        var queryParams = {date: date};

        this.navToLink('business_booking', pathParams, queryParams);
    }
});

Sidebar = connectToStores(Sidebar, [
    'StationStore'
], function (context, props) {
    var business = props.business;
    return {
        stations: business && context.getStore('StationStore').getNearby(business.gps)
    };
});

module.exports = Sidebar;
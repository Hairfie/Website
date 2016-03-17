'use strict';

var React = require('react');
var _ = require('lodash');
var SearchUtils = require('../../lib/search-utils');
var Link = require('../Link.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');

var BreadCrumb = React.createClass({
    contextTypes: {
        getStore: React.PropTypes.func
    },
    render: function () {
        var crumbs = [];
        var business = this.props.business;
        var place  = business ? business.address.city + ', France' : null;
        var currentRoute = this.props.currentRoute;
        crumbs = [
            {
                label: 'Accueil',
                route: 'home',
                params: {}
            }
        ];
        if (business) {
            var businessCrumbs = [
                {
                    label: 'Coiffeurs ' + business.address.city,
                    route: 'business_search',
                    params: {
                        address: SearchUtils.addressToUrlParameter(place)
                    }
                },
                {
                    label: business.name,
                    route: 'business',
                    params: {
                        businessId: business.id,
                        businessSlug: business.slug
                    }
                }
            ];
            
            var businessBookingCrumb = {
                label: 'Réservation',
                route: 'business_booking',
                params: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            };
        }

        var newsletterCrumb = {
            label: 'Newsletter',
            route: 'newsletter'
        };
        var hairfieCrumb = [
            {
                label: 'Tous les Hairfies',
                route: 'hairfie_search',
                params: {
                    address: 'France'
                }
            },
            {
                label: 'Hairfie'
            }
        ];
        var resaCrumb = [
            {
                label: 'Ma réservation'
            }
        ];
        if(this.props.place) {
            var placeCrumbs = [];
            var place  = this.props.place;

            while (place) {
                placeCrumbs.unshift({
                    label: 'Coiffeur ' +  (place.name || '').split(',')[0],
                    route: 'business_search',
                    params: {
                        address: SearchUtils.addressToUrlParameter(place.name)
                    }
                });
                place = place.parent;
            }
        }
        switch(currentRoute.name) {
            case 'business':
            case 'business_reviews':
            case 'business_hairfies': 
                crumbs = crumbs.concat(businessCrumbs);
                break;
            case 'business_booking':
                crumbs = crumbs.concat(businessCrumbs).concat(businessBookingCrumb);
                break;
            case 'booking_confirmation':
                crumbs = crumbs.concat(resaCrumb);
                break;
            case 'newsletter':
                crumbs = crumbs.concat(newsletterCrumb);
                break;
            case 'hairfie':
                crumbs = crumbs.concat(hairfieCrumb);
                break;
            case 'business_search':
            case 'hairfie_search':
                crumbs = crumbs.concat(placeCrumbs);
                break;
        }
        crumbs = _.compact(crumbs);

        return (
            <div className="breadcrumb-container">
                <ol className="breadcrumb">
                    {_.map(crumbs, function (crumb, index) {
                        if (index == crumbs.length - 1) {
                            return (
                                <li key={index}>
                                    {crumb.label}
                                </li>
                            );
                        } else {
                            return (
                                <li key={index}>
                                    <Link route={crumb.route} params={crumb.params}>
                                        <u>{crumb.label}</u>
                                    </Link>
                                </li>
                            );
                        }
                    })}
                </ol>
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: this.getSchema(crumbs)}} />
            </div>
        );
    },
    getSchema: function(crumbs) {
        crumbs = _.rest(crumbs);
        var itemListElement = _.map(crumbs, function(crumb, i) {
            var url = this.context.getStore('RouteStore').makeUrl(crumb.route, crumb.params);
            return {
                "@type": "ListItem",
                "position": i,
                "item": {
                    "@id": url,
                    "name": crumb.label
                }
            }
        }, this)

        var markup = {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": itemListElement
        };

        return JSON.stringify(markup);
    }
});

BreadCrumb = connectToStores(BreadCrumb, ['RouteStore'], function (context) {
    return {
        currentRoute: context.getStore('RouteStore').getCurrentRoute()
    };
});

module.exports = BreadCrumb;
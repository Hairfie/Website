'use strict';

var React = require('react');
var _ = require('lodash');
var SearchUtils = require('../../lib/search-utils');
var Link = require('../Link.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');

var BreadCrumb = React.createClass({
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
        if(this.props.searchedPlace) {
            var placeCrumb = {
                label: (this.props.searchedPlace.name || '').split(',')[0]
            };
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
            case 'newsletter':
                crumbs = crumbs.concat(newsletterCrumb);
                break;
            case 'hairfie':
                crumbs = crumbs.concat(hairfieCrumb);
                break;
            case 'business_search':
            case 'hairfie_search':
                crumbs = crumbs.concat(placeCrumb);
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
            </div>
        );
    }
});

BreadCrumb = connectToStores(BreadCrumb, ['RouteStore'], function (context) {
    return {
        currentRoute: context.getStore('RouteStore').getCurrentRoute()
    };
});

module.exports = BreadCrumb;
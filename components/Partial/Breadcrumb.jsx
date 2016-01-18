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
        var place  = business.address.city + ', France';
        var currentRoute = this.props.currentRoute;
        var businessRoutes = ['business', 'business_reviews', 'business_hairfies'];
        console.log(currentRoute);
        console.log('route: ' + currentRoute.name + ' includes : ' + _.includes(businessRoutes, currentRoute.name));
        crumbs = [
            {
                last: false,
                label: 'Accueil',
                route: 'home',
                params: {}
            },
            {
                last: false,
                label: 'Coiffeurs ' + business.address.city,
                route: 'business_search',
                params: {
                    address: SearchUtils.addressToUrlParameter(place)
                }
            },
            {
                last: true,
                label: business.name,
                route: 'business',
                params: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            }
            /*,
            {
                last: true,
                label: 'Réservation',
                route: 'business_booking',
                params: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            } */
        ];
        if (!_.includes(businessRoutes, currentRoute.name))
        {
            _.last(crumbs).last = false;
            crumbs.push({
                last: true,
                label: 'Réservation',
                route: 'business_booking',
                params: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            });
        }
        console.log('last ' + _.last(crumbs).last);
        return (
            <div className="col-xs-12 visible-md visible-lg">
                <ol className="breadcrumb">
                    {_.map(crumbs, function (crumb) {
                        if (crumb.last) {
                            return (
                                <li>
                                    {crumb.label}
                                </li>
                            );
                        } else {
                            return (
                                <li>
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
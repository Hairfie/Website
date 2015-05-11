'use strict';

var React = require('react');
var _ = require('lodash');
var SearchUtils = require('../../lib/search-utils');
var Link = require('../Link.jsx');

module.exports = React.createClass({
    render: function () {
        var crumbs = [];
        var business = this.props.business;
        var place  = business.address.city + ', France';

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
                last: false,
                label: business.name,
                route: 'business',
                params: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            },
            {
                last: true,
                label: 'Réservation',
                route: 'business_booking',
                params: {
                    businessId: business.id,
                    businessSlug: business.slug
                }
            }
        ];

        return (
            <div className="col-xs-12">
                <ol className="breadcrumb">
                    {_.map(crumbs, function (crumb) {
                        if (crumb.last) {
                            return (
                                <li className="active">
                                    {crumb.label}
                                </li>
                            );
                        } else {
                            return (
                                <li>
                                    <Link route={crumb.route} params={crumb.params}>
                                        {crumb.label}
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

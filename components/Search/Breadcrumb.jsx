'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var SearchUtils = require('../../lib/search-utils');

var Breadcrumb = React.createClass({
    render: function () {
        var crumbs = [];
        var place  = this.props.place;

        while (place) {
            crumbs.unshift({
                id: place.id,
                last: crumbs.length == 0,
                label: (place.name || '').split(',')[0],
                route: 'business_search',
                params: {
                    address: SearchUtils.addressToUrlParameter(place.name)
                }
            });
            place = place.parent;
        }

        crumbs.unshift({
            id: 'home',
            last: false,
            label: 'Accueil',
            route: 'home',
            params: {}
        });

        return (
            <div className="col-xs-12 hidden-xs hidden-sm">
                <ol className="breadcrumb">
                    {_.map(crumbs, function (crumb) {
                        if (crumb.last) {
                            return (
                                <li key={crumb.id} className="active">
                                    {crumb.label}
                                </li>
                            );
                        } else {
                            return (
                                <li key={crumb.id}>
                                    <Link context={this.props.context} route={crumb.route} params={crumb.params}>
                                        {crumb.label}
                                    </Link>
                                </li>
                            );
                        }
                    }, this)}
                </ol>
            </div>
        );
    }
});

module.exports = Breadcrumb;

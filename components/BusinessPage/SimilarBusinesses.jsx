'use strict';

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var Picture = require('../Partial/Picture.jsx');
var _ = require('lodash');

var BusinessLink = React.createClass({
    render: function () {
        var params = {
            businessId  : this.props.business.id,
            businessSlug: this.props.business.slug
        };

        return (
            <NavLink {...this.props} routeName="business" navParams={params}>
                {this.props.children}
            </NavLink>
        );
    }
});

module.exports = React.createClass({
    render: function () {
        return (
            <div className="related-content">
                <h5>Les coiffeurs similaires</h5>
                {_.map(this.props.businesses, this.renderBusiness)}
            </div>
        );
    },
    renderBusiness: function (business) {
        return (
            <section key={business.id} className="rival">
                <div className="row">
                    <BusinessLink className="col-xs-4" business={business}>
                        <Picture picture={business.pictures[0]}
                                 resolution={{width: 90, height: 90}}
                                 placeholder="/images/placeholder-55.png"
                                 alt={business.name}
                        />
                    </BusinessLink>
                    <BusinessLink className="col-xs-8" business={business}>
                        <span>{business.name}</span>
                        {_.values(_.pick(business.address, ['street', 'zipCode', 'city'])).join(', ')}
                    </BusinessLink>
                </div>
            </section>
        );
    }
});

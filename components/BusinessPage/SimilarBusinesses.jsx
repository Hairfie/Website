'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');
var _ = require('lodash');

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
                    <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                        <Picture picture={business.pictures[0]}
                                 resolution={{width: 90, height: 90}}
                                 placeholder="/img/placeholder-90.png"
                                 alt={business.name}
                        />
                    </Link>
                    <Link className="col-xs-8" route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                        <span>{business.name}</span>
                        {_.values(_.pick(business.address, ['street', 'zipCode', 'city'])).join(', ')}
                    </Link>
                </div>
            </section>
        );
    }
});

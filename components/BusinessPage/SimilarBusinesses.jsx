'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');
var _ = require('lodash');

module.exports = React.createClass({
    render: function () {
        if (this.props.slidebar) return this.renderSlidebar();
        return this.renderSimilar();
    },
    renderSimilar: function() {
        return (
            <section>
                <h3>Découvrez les coiffeurs similaires</h3>
                <div className="row similar">
                    {_.map(this.props.businesses, function(business) {
                        return (
                            <div className="col-xs-4" key={business.id}>
                                <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                                    <Picture picture={business.pictures[0]}
                                             resolution={{width: 200, height: 200}}
                                             style={{width: '100%', height: '115px'}}
                                             placeholder="/img/placeholder-90.png"
                                             alt={business.name}
                                    />
                                </Link>
                                <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                                    <h4>{business.name}</h4>
                                    <p>
                                        {_.values(_.pick(business.address, ['street', 'zipCode', 'city'])).join(', ')}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    },
    renderSlidebar: function () {
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
                                 resolution={{width: 55, height: 55}}
                                 style={{width: 55, height: 55}}
                                 placeholder="/img/placeholder-55.png"
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

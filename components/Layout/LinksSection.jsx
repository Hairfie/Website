'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');

module.exports = React.createClass({
    render: function () {
        var colSize = Math.ceil(this.props.links / 3);

        return (
            <div className="suggestion">
                <p className="title">Recherches fréquentes</p>
                <p className="subtitle" />
                <div className="row">
                    {_.map(_.chunk(this.props.links, colSize), this.renderColumn)}
                </div>
            </div>
       );
    },
    renderColumn: function (links, i) {
        return (
            <div key={i} className="col-sm-4 col-xs-12">
                {_.map(links, this.renderLink)}
            </div>
        );
    },
    renderLink: function(link, i) {
        var query = link.category ? {categories: link.category} : {};

        return (
            <p key={link.address}>
                <Link route="business_search" params={{ address: link.address }} query={query}>
                    <span>{link.displayName}</span>
                </Link>
            </p>
        );
    }
});

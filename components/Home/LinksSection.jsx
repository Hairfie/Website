/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    render: function () {
        var colSize = Math.ceil(this.props.links / 3);

        return (
            <section className="home-section seo">
                <h2>Nos suggestions</h2>
                <div className="row">
                    {_.map(_.chunk(this.props.links, colSize), this.renderColumn)}
                </div>
            </section>
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
        var href = link.category ? this.props.context.makeUrl('business_search_results', {address: link.address}, {categories: link.category}) : this.props.context.makeUrl('business_search_results', {address: link.address});
        return (
            <p>
                <NavLink href={href} context={this.props.context}>
                    <span>{link.displayName}</span>
                </NavLink>
            </p>
        );
    }
});

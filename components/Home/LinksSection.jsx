/** @jsx React.DOM */

'use strict';

var React = require('react');
var lodash = require('lodash');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    render: function () {
        return (
            <section className="home-section seo">
                <h2>Nos suggestions</h2>
                <div className="row">
                    <div className="col-sm-4 col-xs-12">
                        {lodash.map(this.props.links[0], this.renderLink, this)}
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        {lodash.map(this.props.links[1], this.renderLink, this)}
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        {lodash.map(this.props.links[2], this.renderLink, this)}
                    </div>
                </div>
            </section>
       );
    },
    renderLink: function(link) {
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
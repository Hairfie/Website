'use strict'

var React = require('react');
var _ = require('lodash');
var NavLink = require('flux-router-component').NavLink;

var Pagination = React.createClass({
    propTypes: {
        currentPage : React.PropTypes.number.isRequired,
        numPages    : React.PropTypes.number.isRequired,
        routeName   : React.PropTypes.string.isRequired,
        pathParams  : React.PropTypes.object,
        queryParams : React.PropTypes.object
    },
    contextTypes: {
        makeUrl: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <nav>
                <ul className="pagination">
                    {_.map(_.range(1, this.props.numPages), function(page) {
                        return (
                            <li className={this.isCurrent(page) ? 'active' : ''}>
                                <NavLink href={this.getHref(page)}>
                                    {page}
                                </NavLink>
                            </li>
                        );
                    }, this)}
                </ul>
            </nav>
        );
    },
    isCurrent: function (page) {
        return page == this.props.currentPage;
    },
    getHref: function (page) {
        return this.context.makeUrl(this.props.routeName, this.props.pathParams, _.assign({}, this.props.queryParams, {
            page: page
        }));
    }
});

module.exports = Pagination;

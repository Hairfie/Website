'use strict'

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');

var Pagination = React.createClass({
    propTypes: {
        currentPage : React.PropTypes.number.isRequired,
        numPages    : React.PropTypes.number.isRequired,
        route       : React.PropTypes.string.isRequired,
        params      : React.PropTypes.object,
        query       : React.PropTypes.object
    },
    render: function () {
        return (
            <nav>
                <ul className="pagination">
                    {_.map(_.map(_.range(1, this.props.numPages), String), function (page) {
                        return (
                            <li key={page} className={this.isCurrent(page) ? 'active' : ''}>
                                <Link route={this.props.route} params={this.props.params} query={this.getQuery(page)}>{page}</Link>
                            </li>
                        );


                        return (
                            <li key={page} className={this.isCurrent(page) ? 'active' : ''}>
                                <Link route={this.props.route} params={this.props.params} query={this.getQuery(page)}>
                                    {page}
                                </Link>
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
    getQuery: function (page) {
        return _.assign({}, this.props.query, { page: page });
    }
});

module.exports = Pagination;

'use strict'

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');

var arroundCurrentPage = 2;

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
            <div className="pagination">
                <ul className="list-inline">
                    {_.map(_.map(this.displayPage(), String), function (page) {
                        if (page == "space")
                            return (<span>...</span>);
                        return (
                            <li key={page}>
                                <Link route={this.props.route} params={this.props.params} query={this.getQuery(page)} className={this.isCurrent(page) ? 'active' : ''}>
                                    {page}
                                </Link>
                            </li>
                        );
                    }, this)}
                </ul>
            </div>
        );
    },
    isCurrent: function (page) {
        return page == this.props.currentPage;
    },
    displayPage: function() {
        var i;
        var addExtremumPage = 0;
        var pageArray = {
            values: [1, this.props.numPages],
            numberOfPrevPage: (this.props.currentPage - 1),
            numberOfNextPage: (this.props.numPages - this.props.currentPage),
            addNextPage: function(n, currentPage) {
                for (i = 1; i <= n && i < this.numberOfNextPage; i++)
                    this.values.push(currentPage + i);
            },
            addPrevPage: function(n, currentPage) {
                for (i = 1; i <= n && i < this.numberOfPrevPage; i++)
                    this.values.push(currentPage - i);
            },
            formatArray: function() {
                this.values.sort(function(a, b){return a-b});
                for (i = 0; i < this.values.length - 1; i++)
                {
                    if (this.values[i] == this.values[i + 1])
                        this.values.splice(i, 1);
                    if (this.values[i] != this.values[(i + 1)] - 1) {
                        this.values.splice((i + 1), 0, "space")
                        i++;
                    }
                }
        if (this[(this.values.length - 1)] == "space")
            this.values.pop();
            }
        };
        if (this.props.currentPage > 1 && this.props.currentPage < this.props.numPages)
            pageArray.values.push(this.props.currentPage);
        if (pageArray.numberOfPrevPage < arroundCurrentPage || pageArray.numberOfNextPage < arroundCurrentPage)
        {
            if (pageArray.numberOfPrevPage < pageArray.numberOfNextPage)
                addExtremumPage = arroundCurrentPage - pageArray.numberOfPrevPage + 1;
            else
                addExtremumPage = arroundCurrentPage - pageArray.numberOfNextPage + 1;
        }
        pageArray.addPrevPage((arroundCurrentPage + addExtremumPage), this.props.currentPage);
        pageArray.addNextPage((arroundCurrentPage + addExtremumPage), this.props.currentPage);
        pageArray.formatArray();
        return pageArray.values;
    },
    getQuery: function (page) {
        return _.assign({}, this.props.query, { page: page });
    }
});

module.exports = Pagination;

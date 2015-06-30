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
                            <li key={page} className={this.isCurrent(page) ? 'active' : ''}>
                                <Link route={this.props.route} params={this.props.params} query={this.getQuery(page)}>
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
    getQuery: function (page) {
        return _.assign({}, this.props.query, { page: page });
    },
    displayPage: function() {
        var i, j = 1, k = 1;
        var pageArray = [1, this.props.currentPage, this.props.numPages];
        for (i = 1; i <= arroundCurrentPage; i++) {
            if (this.props.currentPage - j > 1) {
                pageArray.push(this.props.currentPage - j);
                j++;
            }
            else if (this.props.currentPage + k < this.props.numPages) {
                pageArray.push(this.props.currentPage + k);
                k++;
            }
            if (this.props.currentPage + k < this.props.numPages) {
                pageArray.push(this.props.currentPage + k);
                k++;
            }
            else if (this.props.currentPage - j > 1) {
                pageArray.push(this.props.currentPage - j);
                j++;
            }
        }
        pageArray.sort(function(a, b){return a-b});

        for (i = 0; i < pageArray.length - 1; i++)
        {
            if (pageArray[i] == pageArray[i + 1])
                pageArray.splice(i, 1);
            if (pageArray[i] != pageArray[(i + 1)] - 1) {
                pageArray.splice((i + 1), 0, "space")
                i++;
            }
        }
        if (pageArray[(pageArray.length - 1)] == "space")
            pageArray.pop();
        return pageArray;
    }
});

module.exports = Pagination;

'use strict'

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');

/*
By default 5 pages display:
 First --- Previous - Current - Next --- Last
  if you want more page change the arroundCurrentPage value.
*/
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
        function Pages()
        {
            this.values = [1, this.props.currentPage, this.props.numPages];
            this.hasNextPage = function(num) {
            if (page + num <= this.props.numPages)
                return true;
            return false;
            }
            this.hasPreviousPage = function(num) {
            if (page - num >= 1)
                return true;
            return false;
            }
        }
        var pageArray = new Pages();
/*
        var i, j = 1, k = 1;

        for (i = 1; i <= arroundCurrentPage; i++) {
            if (pageArray.hasPreviousPage(j)) {
                pageArray.values.push(this.props.currentPage - j);
                j++;
            }
            else if (pageArray.hasNextPage(k)) {
                pageArray.values.push(this.props.currentPage + k);
                k++;
            }
            if (pageArray.hasNextPage(k)) {
                pageArray.values.push(this.props.currentPage + k);
                k++;
            }
            else if (pageArray.hasPreviousPage(j)) {
                pageArray.values.push(this.props.currentPage - j);
                j++;
            }
        }
        pageArray.values.sort(function(a, b){return a-b});

        for (i = 0; i < pageArray.values.length - 1; i++)
        {
            if (pageArray.values[i] == pageArray.values[i + 1])
                pageArray.values.splice(i, 1);
            if (pageArray.values[i] != pageArray.values[(i + 1)] - 1) {
                pageArray.values.splice((i + 1), 0, "space")
                i++;
            }
        }
        if (pageArray.values[(pageArray.values.length - 1)] == "space")
            pageArray.values.pop();
        return pageArray.values;*/
    }
});

module.exports = Pagination;
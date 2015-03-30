'use strict';

var _ = require('lodash');
var queryString = require('query-string');
var moment = require('moment');

module.exports = {
    addressToUrlParameter: addressToUrlParameter,
    addressFromUrlParameter: addressFromUrlParameter,
    searchFromRouteAndPlace: searchFromRouteAndPlace,
    searchToRouteParams: searchToRouteParams
};

var DEFAULT_RADIUS = 1000;
var DEFAULT_PAGE   = 1;

function addressToUrlParameter(l) {
    return (l || '')
        .trim()
        .replace('/', ' ')
        .replace(')', '')
        .replace('(', '')
        .replace(']', '')
        .replace('[', '')
        .replace(/\s+/g, ' ')
        .replace(/-/g, '~')
        .replace(/, ?/g, '--')
        .replace(/ /g, '-')
        .replace(/\./g, '%252E');
}


function addressFromUrlParameter(p) {
    return (p || '')
        .trim()
        .replace(/-/g, ' ')
        .replace(/~/g, '-')
        .replace(/ {2}/g,', ')
        .replace(/%2E/g,'.');
}

function searchFromRouteAndPlace(r, p) {
    var date = r.query.date && moment(new Date(r.query.date));

    return {
        address     : addressFromUrlParameter(r.params.address),
        location    : p && !p.bounds && p.location,
        bounds      : p && p.bounds,
        radius      : Number(r.query.radius || DEFAULT_RADIUS),
        query       : r.query.q,
        categories  : _.isString(r.query.categories) ? [r.query.categories] : r.query.categories,
        price       : {
            min : r.query.price_min && Number(r.query.price_min),
            max : r.query.price_max && Number(r.query.price_max)
        },
        page        : Number(r.query.page) || DEFAULT_PAGE,
        date        : date && date.format('YYYY-MM-DD')
    };
}

function searchToRouteParams(s) {
    return {
        path: {
            address: addressToUrlParameter(s.address),
        },
        query: _.pick({
            q           : s.query == '' ? undefined : s.query,
            radius      : s.radius == DEFAULT_RADIUS ? undefined : s.radius,
            categories  : s.categories,
            price_min   : s.price && s.price.min,
            price_max   : s.price && s.price.max,
            page        : s.page == DEFAULT_PAGE ? undefined : s.page,
            date        : s.date
        }, defined)
    };
}

function defined(v) { return !_.isUndefined(v); }

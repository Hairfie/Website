'use strict';

var _ = require('lodash');
var queryString = require('query-string');

module.exports = {
    locationToUrlParameter: locationToUrlParameter,
    locationFromUrlParameter: locationFromUrlParameter,
    searchFromRouteAndPlace: searchFromRouteAndPlace
};

function locationToUrlParameter(l) {
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


function locationFromUrlParameter(p) {
    return (p || '')
        .trim()
        .replace(/-/g, ' ')
        .replace(/~/g, '-')
        .replace(/ {2}/g,', ')
        .replace(/%2E/g,'.');
}

function searchFromRouteAndPlace(r, p) {
    return {
        address     : r.params.address,
        radius      : r.query.radius || 1000,
        categories  : r.query.categories
    };
};

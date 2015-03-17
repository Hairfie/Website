'use strict';

var _ = require('lodash');

module.exports = {
    locationToUrlParameter: locationToUrlParameter,
    locationFromUrlParameter: locationFromUrlParameter,
    searchQueryFromRouteAndPlace: searchQueryFromRouteAndPlace
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

function searchQueryFromRouteAndPlace(r, p) {
    var s = {};
    s.radius = r.query.radius || 1000;
    s.price = {min: 0, max: 2000};

    if (p) {
        // TODO: add bounds
        s.location = p.location;
    }

    return s;
};

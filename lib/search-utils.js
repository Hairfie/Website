'use strict';

var _ = require('lodash');
var queryString = require('query-string');
var moment = require('moment');

module.exports = {
    addressToUrlParameter: addressToUrlParameter,
    addressFromUrlParameter: addressFromUrlParameter,
    searchFromRouteAndPlace: searchFromRouteAndPlace,
    searchToRouteParams: searchToRouteParams,
    searchToTitle: searchToTitle,
    searchToDescription: searchToDescription
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
    var r = r.toJS ? r.toJS() : r;
    var date = r.query.date && moment(new Date(r.query.date));

    return {
        address     : addressFromUrlParameter(r.params.address),
        location    : p && !p.bounds && p.location,
        bounds      : p && p.bounds,
        radius      : Number(r.query.radius || DEFAULT_RADIUS),
        q           : r.query.q,
        categories  : _.isString(r.query.categories) ? [r.query.categories] : r.query.categories,
        tags        : _.isString(r.query.tags) ? [r.query.tags] : r.query.tags,
        priceMin    : r.query.priceMin && Number(r.query.priceMin),
        priceMax    : r.query.priceMax && Number(r.query.priceMax),
        page        : Number(r.query.page) || DEFAULT_PAGE,
        date        : date && date.format('YYYY-MM-DD'),
        withDiscount: r.query.withDiscount
    };
}

function searchToRouteParams(s) {
    return {
        path: {
            address: addressToUrlParameter(s.address),
        },
        query: _.pick({
            q           : s.q == '' ? undefined : s.q,
            radius      : s.radius == DEFAULT_RADIUS ? undefined : s.radius,
            categories  : s.categories,
            tags        : s.tags,
            priceMin    : s.price ? s.price.min : (s.priceMin ? s.priceMin : undefined),
            priceMax    : s.price ? s.price.max : (s.priceMax ? s.priceMax : undefined),
            page        : s.page == DEFAULT_PAGE ? undefined : s.page,
            date        : s.date == '' ? undefined : s.date,
            withDiscount: s.withDiscount === true ? true : undefined
        }, defined)
    };
}

function defined(v) { return !_.isUndefined(v); }

function searchToTitle(search, place, tab) {
    var title = '';

    if (search.categories && search.categories.length == 1 && place.title && place.title.categories && place.title.categories[search.categories[0]]) {
        title = place.title.categories[search.categories[0]];
    }
    else if (search.tags && search.tags.lenght == 1 && place.title && place.title.tags && place.title.tags[search.tags[0]]) {
        title = place.title.tags[search.tags[0]];
    }
    else {
        title = (place.title && place.title.default ? place.title.default : _.isString(place.title) ? place.title : '');
        if (title == '' && tab == 'business' && place.name) {
            title = 'Coiffeurs à ' + (place.name).split(',')[0];
        }
        else if (title == '' && tab == 'hairfie' && place.name) {
            title = 'Hairfies réalisés à ' + (place.name).split(',')[0];
        }
    }
    return title || '';
}

function searchToDescription (search, place) {
    if (search.categories && search.categories.length == 1 && place.description && place.description.categories && place.description.categories[search.categories[0]])
        return place.description.categories[search.categories[0]];
    else if (search.tags && search.tags.lenght == 1 && place.description && place.description.tags && place.description.tags[search.tags[0]])
        return place.description.tags[search.tags[0]];
    else
        return place.description && place.description.default ? place.description.default : _.isString(place.description) ? place.description : '';

}

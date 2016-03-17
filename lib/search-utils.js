'use strict';

var _ = require('lodash');
var queryString = require('query-string');
var moment = require('moment');

module.exports = {
    addressToUrlParameter: addressToUrlParameter,
    addressFromUrlParameter: addressFromUrlParameter,
    searchFromRouteAndPlace: searchFromRouteAndPlace,
    searchToRouteParams: searchToRouteParams,
    businessSearchToTitle: businessSearchToTitle,
    hairfieSearchToTitle: hairfieSearchToTitle,
    searchToDescription: searchToDescription
};

var DEFAULT_RADIUS = 1000;
var DEFAULT_PAGE   = 1;

function address(position)
{
    var httpRequest = new XMLHttpRequest();
    var data;
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200)
            data = JSON.parse(httpRequest.responseText);
            result.innerHTML = data.results[0].formatted_address;
        }
    };
    httpRequest.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true');
    httpRequest.send();
}

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
        days        : _.isString(r.query.days) ? [r.query.days] : r.query.days,
        selections  : _.isString(r.query.selections) ? [r.query.selections] : r.query.selections,
        priceLevel  : _.isString(r.query.priceLevel) ? [r.query.priceLevel] : r.query.priceLevel,
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
            days        : s.days,
            selections  : s.selections,
            priceLevel  : s.priceLevel,
            withDiscount: (s.withDiscount === true || s.withDiscount === "true") ? true : undefined
        }, defined)
    };
}

function defined(v) { return !_.isUndefined(v); }

function isSearchEmpty(search) {
    return _.isUndefined(search.q) && _.isUndefined(search.days) && _.isUndefined(search.priceLevel) && _.isUndefined(search.selections) && _.isUndefined(search.categories) && _.isUndefined(search.tags) && _.isUndefined(search.withDiscount);
}

function paginateTitle(title, search) {
    if(search.page && search.page != 1) {
        return title + ' - page ' + search.page;
    } else {
        return title;
    }
}

function businessSearchToTitle(search, place, url, categories) {
    if(!place) return '';
    var title = '';

    // CASE 2 : path is there
    if(getTitleFromPath(place, url)) {
        title = getTitleFromPath(place, url);
        return paginateTitle(title, search);
    }
    // CASE 3 : categories
    if(place.title && search.categories && search.categories.length == 1 && place.title.categories && place.title.categories[search.categories[0]]) {
        title = place.title.categories[search.categories[0]];
        return paginateTitle(title, search);
    }

    // CASE 4 : Empty Search, default

    if(place.title && isSearchEmpty(search) && place.title.default) {
        title = place.title.default;
        return paginateTitle(title, search);
    }

    // OTHERS
    title = 'Coiffeurs';
    if(search.categories && search.categories.length == 1) {

        var categoryLabel = labelFromCategory(search.categories[0], categories);
        title = title + ' spécialistes ' + categoryLabel;
    }

    if(place && place.name) title = title + ' à ' + (place.name).split(',')[0];

    return paginateTitle(title, search);
}

function getTitleFromPath(place, url) {
    if(!place.title || !place.title.path) return;

    var pathObject = _.mapKeys(place.title.path, function(value, key) {
        return decodeURI(key);
    });
    return pathObject[decodeURI(url)];
}

function hairfieSearchToTitle(search, place, url) {
    if(!place) return '';
    var title = '';
    // CASE 2 : path is there
    if(getTitleFromPath(place, url)) {
        title = getTitleFromPath(place, url);
        return paginateTitle(title, search);
    }
    // CASE 3 : tags
    if(place.title && search.tags && search.tags.length == 1 && place.title.tags && place.title.tags[search.tags[0]]) {
        title = place.title.tags[search.tags[0]];
        return paginateTitle(title, search);
    }

    // OTHERS
    title = 'Hairfies';
    if(search.tags) {
        title = title + ' ' + search.tags.join(", ");
    }

    if(place && place.name) title = title + ' à ' + (place.name).split(',')[0];

    return paginateTitle(title, search);
}

function labelFromCategory(cat, categories) {
    if(!categories) return cat;
    var fullCat = _.find(categories, 'slug', cat);
    if(fullCat && !_.isEmpty(fullCat)) {
        return fullCat.label;
    } else {
        return cat;
    }
}

function getDescriptionFromPath(place, url) {
    if(!place || !place.description || !place.description.path) return;

    var pathObject = _.mapKeys(place.description.path, function(value, key) {
        return decodeURI(key);
    });
    return pathObject[decodeURI(url)];
}

function searchToDescription (search, place, url) {
    if(getDescriptionFromPath(place, url)) {
        return getDescriptionFromPath(place, url);
    } else if (search.categories && search.categories.length == 1 && place && place.description && place.description.categories && place.description.categories[search.categories[0]]) {
        return place.description.categories[search.categories[0]];
    } else if (search.tags && search.tags.length == 1 && place && place.description && place.description.tags && place.description.tags[search.tags[0]]) {
        return place.description.tags[search.tags[0]];
    } else if(!search.categories && !search.tags && place && place.description && place.description.default) {
        return place.description.default;
    } else {
        return '';
    }

}

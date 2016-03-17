'use strict';

var _ = require('lodash');

var arrondissements = require('./links/arrondissements.json');
var categories = require('./links/categories.json');
var quartiers = require('./links/quartiers.json');
var hairfies = require('./links/hairfies.json');
var cities = require('./links/cities.json');
var otherCities = require('./links/otherCities.json');
var selections = require('./links/selections.json');


var footerLinks = [].concat.apply([], [quartiers, categories, arrondissements, cities, selections]);
var xmlLinks = [].concat.apply([], [cities, quartiers, categories, arrondissements, hairfies, otherCities, selections]);

module.exports = {
    footerLinks: footerLinks,
    xmlLinks: xmlLinks
}
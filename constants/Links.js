'use strict';

var _ = require('lodash');

var arrondissements = require('./links/arrondissements.json');
var categories = require('./links/categories.json');
var quartiers = require('./links/quartiers.json');
var hairfies = require('./links/hairfies.json');

var homeLinks = [].concat.apply([], [quartiers, categories, arrondissements]);
var xmlLinks = [].concat.apply([], [quartiers, categories, arrondissements, hairfies]);

module.exports = {
    homeLinks: homeLinks,
    xmlLinks: xmlLinks
}
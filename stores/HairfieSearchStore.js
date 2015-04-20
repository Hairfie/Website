'use strict';

var createStore = require('fluxible/addons/createStore');

var searchKey = JSON.stringify;

module.exports = createStore({
    storeName: 'HairfieSearchStore',
    initialize: function () {
        this.loading = {};
        this.results = {};
    },
    dehydrate: function () {
        return {
            results: this.results
        };
    },
    rehydrate: function (data) {
        this.results = data.results;
    },
    getResult: function (search) {
        var result = this.results[searchKey(search)];
        if (_.isUndefined(result)) {
            this._loadResult(search)
        }

        return result;
    },
    _loadResult: function (search) {
        var key = searchKey(search);
        if (this.loading[key]) return;
        this.loading[key] = true;

        var gpsStr = function (gps) { return [gps.lat, gps.lng].join(','); };

        var query = {};
        query.page = search.page;
        query.pageSize = 12;
        if (search.location) {
            query.location = gpsStr(search.location);
            query.radius = search.radius;
        }
        if (search.bounds) {
            query.bounds = _.flatten(_.map(_.values(search.bounds), gpsStr)).join(',');
        }
        if (search.categories) {
            query.categories = search.categories;
        }
        if (search.priceMin) {
            query.priceMin = search.priceMin;
        }
        if (search.priceMax) {
            query.priceMax = search.priceMax;
        }

        this
            .getContext()
            .getHairfieApi()
            .getHairfieSearchResult(query)
            .then(
                function (result) {
                    this.results[key] = result;
                    this.loading[key] = false;
                    this.emitChange();
                }.bind(this),
                function (error) {
                    this.loading[key] = false;
                }.bind(this)
            );
    }
});

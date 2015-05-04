'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');

var daysOfWeek = {
    MON: 'monday',
    TUE: 'tuesday',
    WED: 'wednesday',
    THU: 'thursday',
    FRI: 'friday',
    SAT: 'saturday',
    SUN: 'sunday'
};

function fullDayOfWeek(abbr) {
    return daysOfWeek[abbr];
}

module.exports = createStore({
    storeName: 'MetaStore',
    handlers: makeHandlers({
        onChangeRouteSuccess: Actions.CHANGE_ROUTE_SUCCESS
    }),
    initialize: function () {
        this.metas = [];
    },
    dehydrate: function () {
        return { metas: this.metas };
    },
    rehydrate: function (state) {
        this.metas = state.metas;
    },
    onChangeRouteSuccess: function (route) {
        switch (route.name) {
            case 'home':
                this._setMetas(this._getHomeMetas());
                break;

            case 'business':
            case 'business_booking':
                this._setMetas(this._getBusinessMetas(route.params.businessId));
                break;

            case 'hairfie':
                this._setMetas(this._getHairfieMetas(route.params.hairfieId));
                break;

            default:
                this._setMetas(this._getDefaultMetas());
        }
    },
    getTitle: function () {
        var meta = _.find(this.metas, {property: 'og:title'});

        return meta && meta.content;
    },
    getMetas: function() {
        return this.metas;
    },
    _setMetas: function (metas) {
        this.metas = metas;
        this.emitChange();
    },
    _getHomeMetas: function () {
        return _.union(this._getBaseMetas(), [
            { property: 'og:title', content: 'Hairfie pour les coiffeurs' },
            { property: 'og:description', content: 'Ajoutez gratuitement votre salon en 3 clics et commencez à diffuser votre talent' },
            { property: 'og:image', content: this.getContext().getAssetUrl('/img/background-pro-trans.jpg') },
            { property: 'og:url', content: this._getUrl('home') }
        ]);
    },
    _getHaifieMetas: function (hairfieId) {
        var hairfie = this.dispatcher.getStore('HairfieStore').getById(hairfieId);

        var title, description;
        if(hairfie.hairdresser) {
            title = 'Hairfie réalisé par ' + hairfie.hairdresser.firstName;
            description = 'Réservez gratuitement en ligne la même prestation réalisée par ' + hairfie.hairdresser.firstName + ' au salon ' + business.name + ' sur Hairfie';
        } else if (hairfie.business) {
            title = 'Hairfie réalisé chez ' + hairfie.business.name;
            description = 'Réservez gratuitement en ligne la même prestation réalisée au salon ' + hairfie.business.name + ' sur Hairfie';
        } else {
            title = 'Hairfie posté par ' + hairfie.author.firstName;
            description = 'Réservez gratuitement votre séance en ligne sur Hairfie'
        }

        if(hairfie.tags) {
            caption += _.map(hairfie.tags, function(tag) { return '#'+tag.name.replace(/ /g,''); }).join(' ');
        }

        var metas = _.union(this._getBaseMetas(), [
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:type', content: this.getContext().config.facebookAppNamespace+':hairfie' },
            { property: 'og:url', content: this._getUrl('hairfie', { hairfieId: hairfie.id }) },
            { property: 'og:image', content: (_.first(hairfie.pictures) || {}).url }
        ]);

        if (hairfie.business) metas.push({
            property: 'hairfie:business',
            content : this._getUrl('business', {
                businessId  : hairfie.business.id,
                businessSlug: hairfie.business.slug
            })
        });

        return metas;
    },
    _getBusinessMetas: function (businessId) {
        var business = this.dispatcher.getStore('BusinessStore').getById(businessId);

        var metas = _.union(
            this._getBaseMetas(),
            [
                { property: 'og:title', content: business.name },
                { property: 'og:description', content: 'Prenez rendez-vous gratuitement en quelques cliques sur Hairfie' },
                { property: 'og:type', content: this.getContext().config.facebookAppNamespace+':business' },
                { property: 'og:url', content: this._getUrl('business', { businessId: business.id, businessSlug: business.slug }) }
            ],
            this._getAddressMetas(business.address)
        );

        _.forEach(business.timetable, function (timeWindows, day) {
            if ((timeWindows.length || []) > 0) {
                metas.push({ property: 'business:hours:day', content: fullDayOfWeek(day) });
                _.forEach(_.take(timeWindows, 2), function (timeWindow) {
                    metas.push({ property: 'business:hours:start', content: timeWindow.startTime });
                    metas.push({ property: 'business:hours:end', content: timeWindow.endTime });
                });
            }
        });

        if (business.gps) {
            metas.push({property: 'place:location:latitude', content: business.gps.lat});
            metas.push({property: 'place:location:longitude', content: business.gps.lng});
        }

        if (business.pictures) {
            _.forEach(business.pictures, function (picture) {
                metas.push({ propery: 'og:image', content: picture.url });
            });
        } else {
            metas.push({ property: 'og:image', content: this._getAssetUrl('/images/logo-red.png') });
        }

        return metas;
    },
    _getDefaultMetas: function () {
        return _.union(this._getBaseMetas(), [
            { property: 'og:title', content: this.currentRoute && this.currentRoute.options.title || 'Hairfie, trouvez et réservez votre coiffeur' }
        ]);
    },
    _getBaseMetas: function () {
        return [
            { property: 'fb:app_id', content: this.getContext().config.facebookAppId },
            { property: 'og:locale', content: 'fr_FR' }
        ];
    },
    _getAddressMetas: function (address) {
        if (address) {
            return [
                { property: 'business:contact_data:street_address', content: address.street },
                { property: 'business:contact_data:locality', content: address.city },
                { property: 'business:contact_data:postal_code', content: address.zipCode },
                { property: 'business:contact_data:country_name', content: address.country }
            ];
        }
    },
    _getUrl: function (route, params, query) {
        var path = this.getContext().makeUrl(route, params, query);
        return (this.getContext().config.url || '')+path;
    },
    _getAssetUrl: function (asset) {
        return this.getContext().getAssetUrl(asset);
    }
});

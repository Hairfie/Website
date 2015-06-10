'use strict';

var createStore = require('fluxible/addons/createStore');
var _ = require('lodash');
var Actions = require('../constants/Actions');
var SearchUtils = require('../lib/search-utils');

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
    handlers: {
        'NAVIGATE_SUCCESS': 'onNavigateSuccess'
    },
    initialize: function () {
        this.metas = [];
    },
    dehydrate: function () {
        return { metas: this.metas };
    },
    rehydrate: function (state) {
        this.metas = state.metas;
    },
    onNavigateSuccess: function (route) {
        switch (route.get('name')) {
            case 'home':
                this._setMetas(this._getHomeMetas());
                break;

            case 'business':
            case 'business_reviews':
            case 'business_hairfies':
            case 'business_booking':
                this._setMetas(this._getBusinessMetas(route.get('params').get('businessId'), route.get('name')));
                break;

            case 'hairfie':
                this._setMetas(this._getHairfieMetas(route.get('params').get('hairfieId')));
                break;

            case 'business_search':
                this._setMetas(this._getBusinessSearchMetas(route));
                break;

            case 'hairfie_search':
                this._setMetas(this._getHairfieSearchMetas(route));
                break;

            default:
                this._setMetas(this._getDefaultMetas(route));
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
            { property: 'og:title', content: 'Hairfie' },
            { property: 'og:description', content: 'Trouvez et réservez le coiffeur qui vous correspond grâce à nos #hairfies' },
            { property: 'og:image', content: this.getContext().getAssetUrl('/img/background-pro-trans.jpg') },
            { property: 'og:url', content: this._getUrl('home') }
        ]);
    },
    _getHairfieMetas: function (hairfieId) {
        var hairfie = this.dispatcher.getStore('HairfieStore').getById(hairfieId);

        var title, description;
        if(hairfie.hairdresser) {
            title = 'Hairfie réalisé par ' + hairfie.hairdresser.firstName;
            description = 'Réservez gratuitement en ligne la même prestation réalisée par ' + hairfie.hairdresser.firstName + ' au salon ' + hairfie.business.name + ' sur Hairfie';
        } else if (hairfie.business) {
            title = 'Hairfie réalisé chez ' + hairfie.business.name;
            description = 'Réservez gratuitement en ligne la même prestation réalisée au salon ' + hairfie.business.name + ' sur Hairfie';
        } else {
            title = 'Hairfie posté par ' + hairfie.author.firstName;
            description = 'Réservez gratuitement votre séance en ligne sur Hairfie'
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
    _getBusinessMetas: function (businessId, routeName) {
        var business = this.dispatcher.getStore('BusinessStore').getById(businessId);
        var title = business.name + ' à ' + business.address.city;
        var description;

        switch (routeName) {
            case 'business':
                if(business.description) {
                    description = business.description.businessTitle + ' - ' + business.description.businessText + ' - ' + business.description.geoTitle;
                } else {
                    description = 'Découvrez les hairfies du salon ' + title + ' et réservez en ligne';
                }
                break;
            case 'business_reviews':
                title = 'Les avis sur ' + title;
                description = 'Les avis des internautes sur ' + business.name;
                break;
            case 'business_hairfies':
                title = 'Les Hairfies de ' + title;
                description = 'Retrouvez en photos les prestations réalisées au salon ' + business.name;
                break;
            case 'business_booking':
                title = 'Réservez chez ' + title;
                break;
        }

        title += ' | Hairfie';

        var metas = _.union(
            this._getBaseMetas(),
            [
                { property: 'og:title', content: title },
                { property: 'og:description', content: 'Prenez rendez-vous gratuitement en quelques clics sur Hairfie' },
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
    _getBusinessSearchMetas: function(route) {
        var route = route.toJS(),
            query   = route.query,
            params  = route.params;

        var address = SearchUtils.addressFromUrlParameter(params.address);
        var categories        = query.categories,
            displayCategories = '';

        if(!_.isArray(categories)) categories = [categories];
        displayCategories = categories.join(', ');

        var title = 'Coiffeurs ' + displayCategories + ' à ' + address;
        if(query.withDiscount) title = 'Promotions à ' + address;

        if(query.page) title += ' - page ' + query.page;

        var metas = _.union(
            this._getBaseMetas(),
            [
                { property: 'og:title', content: title }
            ]
        );

        return metas;
    },
    _getHairfieSearchMetas: function(route) {
        var route = route.toJS(),
            query   = route.query,
            params  = route.params;

        var address = SearchUtils.addressFromUrlParameter(params.address);
        var categories        = query.categories,
            displayCategories = '';

        if(!_.isArray(categories)) categories = [categories];
        displayCategories = categories.join(', ');

        var title = 'Hairfies ' + displayCategories + ' à ' + address;

        if(query.page) title += ' - page ' + query.page;

        var metas = _.union(
            this._getBaseMetas(),
            [
                { property: 'og:title', content: title }
            ]
        );

        return metas;
    },
    _getDefaultMetas: function (route) {
        var title = route.get('title') || 'Hairfie, trouvez et réservez votre coiffeur';

        return _.union(this._getBaseMetas(), [
            { property: 'og:title', content: title }
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
        var path = this.dispatcher.getStore('RouteStore').makeUrl(route, params, query);
        return (this.getContext().config.url || '')+path;
    },
    _getAssetUrl: function (asset) {
        return this.getContext().getAssetUrl(asset);
    }
});

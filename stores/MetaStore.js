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
        switch (route.name) {
            case 'home':
                this._setMetas(this._getHomeMetas());
                break;

            case 'business':
            case 'business_reviews':
            case 'business_hairfies':
            case 'business_booking':
                this._setMetas(this._getBusinessMetas(route.params.businessId, route.name));
                break;

            case 'hairfie':
                this._setMetas(this._getHairfieMetas(route.params.hairfieId));
                break;

            case 'business_search':
                this._setMetas(this._getBusinessSearchMetas(route));
                break;

            case 'hairfie_search':
                this._setMetas(this._getHairfieSearchMetas(route));
                break;
            case 'user_hairfies':
            case 'user_likes':
            case 'user_reviews':
                this._setMetas(this._getUserMetas(route.params.userId, route.name));
                break;
            case 'hairdresser':
            case 'hairdresser_hairfies':
                this._setMetas(this._getHairdresserMetas(route.params.id, route.name));
                break
            default:
                this._setMetas(this._getDefaultMetas(route));
        }
    },
    getTitle: function () {
        var meta = _.find(this.metas, {property: 'og:title'});
        return meta && meta.content;
    },
    getCanonicalUrl: function() {
        var meta = _.find(this.metas, {property: 'url'});
        return meta && meta.content;
    },
    getMetas: function() {
        return this.metas;
    },
    _setMetas: function (metas) {
        var ogDescription = _.find(metas, {property: 'og:description'});
        var description = _.find(metas, {property: 'description'});

        if(!description && ogDescription) metas.push({ property: 'description', content: ogDescription.content });

        this.metas = metas;

        this.emitChange();
    },
    _getHomeMetas: function () {
        return _.union(this._getBaseMetas(), [
            { property: 'og:title', content: 'Hairfie' },
            { property: 'og:description', content: 'Trouvez et réservez le coiffeur qui vous correspond grâce à nos #hairfies' },
            { property: 'og:image', content: this.getContext().getAssetUrl('/img/background-pro-trans.jpg') },
            { property: 'og:url', content: this._getUrl('home') },
            { property: 'url', content: this._getUrl('home') }
        ]);
    },
    _getHairfieMetas: function (hairfieId) {
        var hairfie = this.dispatcher.getStore('HairfieStore').getById(hairfieId);

        var title, description;
        if(hairfie.hairdresser) {
            title = 'Hairfie réalisé par ' + hairfie.hairdresser.firstName;
            description = 'Prenez rdv pour la même prestation réalisée par ' + hairfie.hairdresser.firstName + ' au salon ' + hairfie.business.name + ' sur Hairfie';
        } else if (hairfie.business) {
            title = 'Hairfie réalisé chez ' + hairfie.business.name;
            description = 'Prenez rdv pour la même prestation réalisée au salon ' + hairfie.business.name + ' sur Hairfie';
        } else {
            title = 'Hairfie posté par ' + hairfie.author.firstName;
            description = 'Prenez rdv avec votre coiffeur sur Hairfie'
        }

        var metas = _.union(this._getBaseMetas(), [
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:type', content: this.getContext().config.facebookAppNamespace+':hairfie' },
            { property: 'og:url', content: this._getUrl('hairfie', { hairfieId: hairfie.id }) },
            { property: 'url', content: this._getUrl('hairfie', { hairfieId: hairfie.id }) },
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
                    description = 'Prendre RDV en ligne dans ce salon de coiffure. ' + business.description.businessTitle + ' - ' + business.description.businessText + ' - ' + business.description.geoTitle;
                } else {
                    description = 'Découvrez les hairfies du salon ' + title + ' et Prenez RDV en ligne';
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

        title += ' | Prendre RDV en ligne sur Hairfie';
        var url = this._getUrl(routeName, { businessId: business.id, businessSlug: business.slug });

        var description = description ? description : 'Prenez RDV gratuitement en quelques clics sur Hairfie';
        var metas = _.union(
            this._getBaseMetas(),
            [
                { property: 'og:title', content: title },
                { property: 'og:description', content: description },
                { property: 'og:type', content: this.getContext().config.facebookAppNamespace+':business' },
                { property: 'og:url', content: this._getUrl('business', { businessId: business.id, businessSlug: business.slug }) },
                { property: 'url', content: url }
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
                metas.push({ property: 'og:image', content: picture.url });
            });
        } else {
            metas.push({ property: 'og:image', content: this._getAssetUrl('/img/logo-red.png') });
        }

        return metas;
    },
    _getBusinessSearchMetas: function(route) {
        var query   = route.query;
        var params  = route.params;

        var categories        = query.categories;

        var address = SearchUtils.addressFromUrlParameter(params.address);
        var place = this.dispatcher.getStore('PlaceStore').getByAddress(address);

        var search = {
            categories: [categories]
        };

        var title = SearchUtils.searchToTitle(search, place, "business");
        var description = SearchUtils.searchToDescription(search, place);
        if(query.withDiscount) title = 'Promotions à ' + address;

        if(query.page) title += ' - page ' + query.page;

        var metas = _.union(
            this._getBaseMetas(),
            [
                { property: 'og:title', content: title },
                { property: 'og:description', content: description }
            ]
        );

        return metas;
    },
    _getHairfieSearchMetas: function(route) {
        var query   = route.query;
        var params  = route.params;

        var tags        = query.tags;

        var address = SearchUtils.addressFromUrlParameter(params.address);
        var place = this.dispatcher.getStore('PlaceStore').getByAddress(address);

        var search = {
            tags: [tags]
        };
        var title = SearchUtils.searchToTitle(search, place, "hairfie");
        var description = SearchUtils.searchToDescription(search, place);

        if(query.page) title += ' - page ' + query.page;

        var metas = _.union(
            this._getBaseMetas(),
            [
                { property: 'og:title', content: title },
                { property: 'og:description', content: description }
            ]
        );

        return metas;
    },
    _getUserMetas: function(id, routeName) {
        var user = this.dispatcher.getStore('UserStore').getById(id) || {};

        var title, description;
        switch(routeName) {
            case 'user_likes':
                title = "Les Hairfies aimés par " + user.firstName;
                description = "Découvrez les hairfies préférés de " + user.firstName;
                break;
            case 'user_hairfies':
                title = "Les hairfies de " + user.firstName;
                description = "Admirez les hairfies de " + user.firstName;
                break;
            case 'user_reviews':
                title = "Les avis de " + user.firstName;
                description = "Découvrez les avis de " + user.firstName + " sur différents salon";
            default:
                description = "Profil de " + user.firstName;
        }

        var metas = _.union(this._getBaseMetas(), [
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: this._getUrl(routeName, { userId: user.id }) }
        ]);

        return metas;
    },
    _getHairdresserMetas: function(id, routeName) {
        var hairdresser = this.dispatcher.getStore('HairdresserStore').getById(id);

        var title, description;
        switch(routeName) {
            case 'hairdresser':
                title = "Profil coiffeur de " + hairdresser.firstName;
                description = "Retrouvez toutes les informations sur " + hairdresser.firstName;
                break;
            case 'hairdresser_hairfies':
                title = "Les hairfies coiffés par " + hairdresser.firstName;
                description = "Découvrez les hairfies coiffés par " + hairdresser.firstName;
                break;
            default:
                description = "Profil coiffeur de " + user.firstName;
        }

        var metas = _.union(this._getBaseMetas(), [
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: this._getUrl(routeName, { id: hairdresser.id }) }
        ]);

        return metas;
    },
    _getDefaultMetas: function (route) {
        var title = route.title || 'Hairfie, trouvez et réservez votre coiffeur';

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

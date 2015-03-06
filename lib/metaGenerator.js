'use strict';

var serverConfig   = require('../configs/server');
var facebookConfig = require('../configs/facebook');
var _              = require('lodash');

var urlGenerator = {
    user: function(user) {
        return serverConfig.URL + '/users/' + user.id;
    },
    business: function(business) {
        if(business.slug) {
            return serverConfig.URL + '/businesses/' + business.id + '/' + business.slug;
        } else {
            return serverConfig.URL + '/businesses/' + business.id;
        }

    },
    hairfie: function(hairfie) {
        return serverConfig.URL + '/hairfies/' + hairfie.id;
    }
}

var globalMetas = [
    { property: "fb:app_id", content: facebookConfig.APP_ID },
    { property: "og:locale:alternate", content: "fr_FR" }
];

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


module.exports = {
    getBasicMetadata: function() {
        var metas = [];
        metas.push.apply(metas, globalMetas);
        metas.push({property: "og:image", content: serverConfig.URL + '/img/logo@2x.png'});
        metas.push({property: "og:title", content: "Hairfie"});
        metas.push({property: "og:url", content: serverConfig.URL});

        return metas;
    },

    getHairfieMetadata: function (hairfie) {
        var author         = hairfie.author,
            business       = hairfie.business,
            metas          = [],
            canonicalUrl   = urlGenerator.hairfie(hairfie),
            homeUrl        = serverConfig.URL,
            authorUrl      = author ? urlGenerator.user(author) : null,
            businessUrl    = business ? urlGenerator.business(business) : null,
            title          = null,
            hairdresserUrl = null,
            description    = null;

        if(hairfie.hairdresser) {
            title = 'Hairfie réalisé par ' + hairfie.hairdresser.firstName;
            description = 'Réservez gratuitement en ligne avec le même style par ' + hairfie.hairdresser.firstName + ' au salon ' + business.name + ' sur Hairfie';
        } else if(business) {
            title = 'Hairfie réalisé chez ' + business.name;
            description = 'Réservez gratuitement en ligne avec le même style au salon ' + business.name + ' sur Hairfie';
        } else {
            title = 'Hairfie posté par ' + author.firstName;
            description = 'Réservez gratuitement votre séance en ligne sur Hairfie'
        }

        title += ' | Hairfie'

        if(hairfie.tags) {
            description += _.map(hairfie.tags, function(tag) { return '#'+tag.name.replace(/ /g,''); }).join(" ");
        }

        metas.push.apply(metas, globalMetas);
        metas.push({property: "og:type", content: facebookConfig.APP_NAMESPACE+':hairfie'});
        metas.push({property: "og:url", content: canonicalUrl});
        metas.push({property: "og:title", content: title});
        metas.push({property: "og:image", content: hairfie.picture.url});
        metas.push({property: "og:description", content: description})

        if (authorUrl) {
            metas.push({property: "hairfie:author", content: authorUrl});
        }
        if (businessUrl) {
            metas.push({property: "hairfie:business", content: businessUrl});
        }
        if (hairdresserUrl) {
            metas.push({property: "hairfie:hairdresser", content: hairdresserUrl});
        }
        return metas;
    },

    getBusinessMetadata: function(business) {
        var title          = business.name + ' | Hairfie',
            description    = 'Prenez rendez-vous gratuitement en quelques clics sur Hairfie',
            metas          = [],
            canonicalUrl   = urlGenerator.business(business),
            homeUrl        = serverConfig.URL;

        metas.push.apply(metas, globalMetas);
        metas.push({property: "og:type", content: facebookConfig.APP_NAMESPACE+':business'});
        metas.push({property: "og:url", content: canonicalUrl});
        metas.push({property: "og:title", content: title});
        metas.push({property: "og:description", content: description});

        if (business.address) {
            metas.push({property: "business:contact_data:street_address", content: business.address.street});
            metas.push({property: "business:contact_data:locality", content: business.address.city});
            metas.push({property: "business:contact_data:postal_code", content: business.address.zipCode});
            metas.push({property: "business:contact_data:country_name", content: business.address.country});
        }

        if (business.timetable) {
            for (var day in business.timetable) {
                var timeWindows = business.timetable[day];

                if (0 == timeWindows.length) continue;

                metas.push({property: "business:hours:day", content: fullDayOfWeek(day)});
                for (var i = 0; i < Math.min(timeWindows.length, 2); i++) {
                    var timeWindow = timeWindows[i];
                    metas.push({property: "business:hours:start", content: timeWindow.startTime});
                    metas.push({property: "business:hours:end", content: timeWindow.endTime});
                }
            }
        }

        if (business.gps) {
            metas.push({property: "place:location:latitude", content: business.gps.lat});
            metas.push({property: "place:location:longitude", content: business.gps.lng});
        }

        business.pictures.map(function (picture) {
            metas.push({property: "og:image", content: picture.url});
        });

        return metas;
    }
};

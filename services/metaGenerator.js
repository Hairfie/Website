'use strict';

var config = require('../config/config');
var _ = require('lodash');

var urlGenerator = {
    user: function(user) {
        return config.url + '/users/' + user.id;
    },
    business: function(business) {
        if(business.slug) {
            return config.url + '/businesses/' + business.id + '/' + business.slug;
        } else {
            return config.url + '/businesses/' + business.id;
        }

    },
    hairfie: function(hairfie) {
        return config.url + '/hairfies/' + hairfie.id;
    }
}

var globalMetas = [
    { property: "fb:app_id", content: config.facebookAppId },
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
    getHomeMetas: function(cb) {
        var metas = [];
        metas.push.apply(metas, globalMetas);
        metas.push({property: "og:image", content: config.url + '/img/logo@2x.png'});
        metas.push({property: "og:title", content: "Hairfie"});
        metas.push({property: "og:url", content: config.url});

        cb(metas);
    },

    getHairfieMetas: function(hairfie, cb) {
        var author         = hairfie.author,
            business       = hairfie.business,
            title          = 'Hairfie shared by '+author.firstName+' '+author.lastName.substr(0, 1)+'.',
            metas          = [],
            canonicalUrl   = urlGenerator.hairfie(hairfie),
            homeUrl        = config.url,
            authorUrl      = author ? urlGenerator.user(author) : null,
            businessUrl    = business ? urlGenerator.business(business) : null,
            hairdresserUrl = null,
            description    = null;

        description = hairfie.descriptions.facebook;

        metas.push.apply(metas, globalMetas);
        metas.push({property: "og:type", content: config.facebookAppNamespace+':hairfie'});
        metas.push({property: "og:url", content: canonicalUrl});
        metas.push({property: "og:title", content: title});
        metas.push({property: "og:image", content: hairfie.picture.url});

        if (description) {
            metas.push({property: "og:description", content: description});
        }
        if (authorUrl) {
            metas.push({property: "hairfie:author", content: authorUrl});
        }
        if (businessUrl) {
            metas.push({property: "hairfie:business", content: businessUrl});
        }
        if (hairdresserUrl) {
            metas.push({property: "hairfie:hairdresser", content: hairdresserUrl});
        }
        cb(metas);
    },

    getBusinessMetas: function(business, cb) {
        var title          = business.name,
            metas          = [],
            canonicalUrl   = urlGenerator.business(business),
            homeUrl        = config.url;

        metas.push.apply(metas, globalMetas);
        metas.push({property: "og:type", content: config.facebookAppNamespace+':business'});
        metas.push({property: "og:url", content: canonicalUrl});
        metas.push({property: "og:title", content: title});

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

        if (business.description) {
            metas.push({property: "og:description", business: business.description});
        }

        cb(metas);
    }
};
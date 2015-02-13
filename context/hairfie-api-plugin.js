'use strict';

module.exports = function (options) {
    var Client = options.Client,
        apiUrl = options.apiUrl;

    return {
        name: 'HairfieApi',
        plugContext: function (options, context, app) {
            var client = new Client({
                apiUrl  : apiUrl,
                locale  : function () { return store(context, 'LocaleStore').getLocale(); },
                token   : function () { return store(context, 'AuthStore').getToken(); }
            });

            return {
                plugActionContext: function (actionContext) {
                    actionContext.getHairfieApi = function () { return client; };
                }
            };
        }
    };
};

function store(context, name) {
    return context._dispatcher.getStore(name);
};

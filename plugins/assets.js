'use strict';

function assetsPlugin(options) {
    var options = options;

    return {
        name: 'AssetsPlugin',
        plugContext: function () {
            return {
                plugStoreContext: function (storeContext) {
                    storeContext.getAssetUrl = getUrl.bind(null, options);
                },
                plugComponentContext: function (componentContext) {
                    componentContext.getAssetUrl = getUrl.bind(null, options);
                }
            };
        },
        dehydrate: function () {
            return { options: options };
        },
        rehydrate: function (state) {
            options = state.options;
        }
    };
}

module.exports = assetsPlugin;

function getUrl(options, asset) {
    var url = (options.cdnUrl || '/assets') + asset;

    if (options.version) {
        if(!url.match(/\?./)) url = url + '?';

        url = url+'v=aa'+options.version;
    }

    return url;
}

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
    var url = (options.cdnUrl || '')+asset;

    if (options.version) {
        url = url+'?v='+options.version;
    }

    return url;
}

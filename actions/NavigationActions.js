'use strict';

var navigateAction = require('flux-router-component/actions/navigate');

module.exports = {
    navigate: function navigate(context, params) {
        var url = params.url || context.router.makeUrl(params.route, params.params, params.query);

        return context.executeAction(navigateAction, { url: url });
    }
};

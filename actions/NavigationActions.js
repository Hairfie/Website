'use strict';

var navigateAction = require('flux-router-component/actions/navigate');

module.exports = {
    navigate: function navigate(context, payload) {
        var url = payload.url || context.router.makeUrl(payload.route, payload.params, payload.query);

        return context.executeAction(navigateAction, { url: url });
    }
};

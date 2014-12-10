'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var BusinessEvents = require('../constants/BusinessConstants').Events;
var BusinessActions = require('../actions/Business');

var Navigate = require('flux-router-component/actions/navigate');

module.exports = createStore({
    storeName: 'SlugStore',
    handlers: makeHandlers({
        handleOpenWithBadSlug: BusinessEvents.OPEN_WITH_BAD_SLUG,
    }),
    handleOpenWithBadSlug: function(payload){
        this.dispatcher.getContext().executeAction(Navigate, {path: payload.path});
    }
});
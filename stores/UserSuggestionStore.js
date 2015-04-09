'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var UserEvents = require('../constants/UserConstants').Events;
var UserActions = require('../actions/User');

module.exports = createStore({
    storeName: 'UserSuggestionStore',
    handlers: makeHandlers({
        handleReceiveSuggestionsSuccess: UserEvents.RECEIVE_SUGGESTIONS_SUCCESS
    }),
    initialize: function () {
        this.suggestions = {};
    },
    handleReceiveSuggestionsSuccess: function (payload) {
        this.suggestions[payload.query] = payload.users || [];
        this.emitChange();
    },
    getSuggestionsForQuery: function (query) {
        if (!this.suggestions[query]) {
            this.dispatcher.getContext().executeAction(UserActions.RefreshSuggestions, {
                query: query
            });
        }

        return this.suggestions[query];
    }
});

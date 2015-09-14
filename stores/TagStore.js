'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var TagActions = require('../actions/TagActions');

var Actions = require('../constants/Actions');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'TagStore',
    handlers: makeHandlers({
        onReceiveTags: Actions.RECEIVE_TAGS
    }),
    initialize: function () {
        this.tags;
    },
    dehydrate: function () {
        return {
            tags: this.tags
        };
    },
    rehydrate: function (data) {
        this.tags = data.tags;
    },
    onReceiveTags: function (tags) {
        this.tags = _.sortBy(tags, 'position');;
        this.emitChange();
    },
    getAllSorted: function () {
        if (!this.tags || _.isEmpty(this.tags))
            this.getContext().executeAction(TagActions.loadAll);
        return this.tags;
    }
});

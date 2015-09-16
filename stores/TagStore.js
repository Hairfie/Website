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
        this.tagCategory;
    },
    dehydrate: function () {
        return {
            tags: this.tags,
            tagCategory: this.tagCategory
        };
    },
    rehydrate: function (data) {
        this.tags = data.tags;
        this.tagCategory = data.tagCategory;
    },
    onReceiveTags: function (tags) {
        this.tags = _.sortByAll(tags, ['category.position', 'position']);

        this.tagCategory = _.uniq(_.sortBy(_.map(tags, function (tag) {
            return tag.category;
        }), 'position'), 'id');

        this.emitChange();
    },
    getAllTags: function () {
        if (!this.tags || _.isEmpty(this.tags))
            this.getContext().executeAction(TagActions.loadAll);
        return this.tags;
    },
    getTagCategories: function() {
        if (!this.tagCategory || _.isEmpty(this.tagCategory))
            this.getContext().executeAction(TagActions.loadAll);
        return this.tagCategory;
    },
    getTagsById: function(tagsId) {
        if (!this.tags || _.isEmpty(this.tags))
            this.getContext().executeAction(TagActions.loadAll);

        return _.compact(_.map(this.tags, function(tag) {
            if (_.isEmpty(_.intersection([tag.id], tagsId)))
                return;
            return tag;
        }));
    },
    getTagsByName: function(tagsName) {
        if (!this.tags || _.isEmpty(this.tags))
            this.getContext().executeAction(TagActions.loadAll);

        return _.compact(_.map(this.tags, function(tag) {
            if (_.isEmpty(_.intersection([tag.name], tagsName)))
                return;
            return tag;
        }));
    }
});

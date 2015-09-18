'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var CategoryActions = require('../actions/CategoryActions');

var Actions = require('../constants/Actions');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'CategoryStore',
    handlers: makeHandlers({
        onReceiveCategories: Actions.RECEIVE_CATEGORIES
    }),
    initialize: function () {
        this.categories;
    },
    dehydrate: function () {
        return {
            categories: this.categories
        };
    },
    rehydrate: function (data) {
        this.categories = data.categories;
    },
    onReceiveCategories: function (categories) {
        this.categories = _.sortBy(categories, 'position');
        this.emitChange();
    },
    getAllCategories: function () {
        if (!this.categories || _.isEmpty(this.categories))
            this.getContext().executeAction(CategoryActions.loadAll);
        return this.categories;
    },
    getCategoriesByTagsId: function (tagsId) {
        if (!this.categories || _.isEmpty(this.categories)) {
            this.getContext().executeAction(CategoryActions.loadAll);
            return;
        }
        return _.compact(_.map(this.categories, function(category) {
            var match = _.compact(_.map(category.tags, function(tag) {
                if (_.isEmpty(_.intersection([tag], tagsId)))
                    return;
                else
                    return true;
            }));
            if (!(_.isEmpty(match)))
                return category;
        }.bind(this)));
    },
    getCategoriesByName: function(categoriesName) {
        if (!this.categories || _.isEmpty(this.categories)) {
            this.getContext().executeAction(CategoryActions.loadAll);
            return;
        }

        return _.compact(_.map(this.categories, function(category) {
            if (_.isEmpty(_.intersection([category.name], categoriesName)))
                return;
            return category;
        }));
    },
    getCategoriesById: function(categoriesId) {
        if (!this.categories || _.isEmpty(this.categories)) {
            this.getContext().executeAction(CategoryActions.loadAll);
            return;
        }

        return _.compact(_.map(this.categories, function(category) {
            if (_.isEmpty(_.intersection([category.id], categoriesId)))
                return;
            return category;
        }));
    }
});

'use strict';

var _ = require('lodash');

var CategoryEvents = require('../../constants/CategoryConstants').Events;

module.exports = function FetchTop(context, payload, done) {
    var done = done || _.noop();

    context.dispatch(CategoryEvents.FETCH_ALL);

    context
        .getHairfieApi()
        .getCategories()
        .then(function (categories) {
            context.dispatch(CategoryEvents.FETCH_ALL_SUCCESS, {
                categories: categories
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(CategoryEvents.FETCH_ALL_FAILURE);
            done(error);
        });
}
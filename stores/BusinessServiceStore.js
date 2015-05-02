'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessServiceStore',
    handlers: makeHandlers({
        onReceiveBusinessServices: Actions.RECEIVE_BUSINESS_SERVICES
    }),
    initialize: function () {
        this.services = {};
    },
    dehydrate: function () {
        return { services: this.services };
    },
    rehydrate: function (state) {
        this.services = state.services;
    },
    onReceiveBusinessServices: function (services) {
        this.services = _.assign({}, this.services, _.indexBy(services, 'id'));
        this.emitChange();
    },
    getByBusiness: function (businessId) {
        return _.filter(this.services, function (service) {
            return service.business && service.business.id == businessId
        });
    }
});

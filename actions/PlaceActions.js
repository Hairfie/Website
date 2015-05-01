'use strict';

var _ = require('lodash');
var Actions = require('../constants/Actions');

module.exports = {
    loadAddressPlace: function (context, address) {
        return context.hairfieApi
            .get('/places', { query: { address: address } })
            .then(function (places) {
                context.dispatch(Actions.RECEIVE_ADDRESS_PLACE, {
                    address : address,
                    place   : _.first(places)
                });
            });
    }
};

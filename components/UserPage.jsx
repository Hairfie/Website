'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var UserPage = React.createClass({








});

UserPage = connectToStores(UserPage, [
    'UserStore'
], function (stores, props) {
    return {
        user: stores.UserStore.getById(props.route.params.bookingId)
    };
});
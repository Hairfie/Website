'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var UserLayout = require('./UserPage/Layout.jsx');
var Link = require('./Link.jsx');

var UserHairfiesPage = React.createClass({
    render: function () {
        return(
            <UserLayout user={this.props.user} tab="hairfies">
            </UserLayout>
        );
    }
});

UserHairfiesPage = connectToStores(UserHairfiesPage, [
    'UserStore'
], function (stores, props) {
    return {
        user: stores.UserStore.getById(props.route.params.userId)
    };
});

module.exports = UserHairfiesPage;
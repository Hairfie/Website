'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var UserLayout = require('./UserPage/Layout.jsx');
var Link = require('./Link.jsx');

var UserLikesPage = React.createClass({
    render: function () {
        return(
            <UserLayout user={this.props.user} tab="likes">
            </UserLayout>
        );
    }
});

UserLikesPage = connectToStores(UserLikesPage, [
    'UserStore'
], function (stores, props) {
    return {
        user: stores.UserStore.getById(props.route.params.userId)
    };
});

module.exports = UserLikesPage;
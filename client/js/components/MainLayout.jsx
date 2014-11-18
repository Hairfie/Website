/** @jsx React.DOM */

var React = require('react');
var Reflux = require('reflux');

var SessionStore = require('../stores/SessionStore');

function getStateFromStores() {
    return {
        user: SessionStore.getUser()
    }
}

module.exports = React.createClass({
    mixins: [
        Reflux.listenTo(SessionStore, 'onChange')
    ],
    getInitialState: function () {
        return getStateFromStores();
    },
    render: function () {
        var userMessage = this.state.user ? 'Hello '+this.state.user.firstName+'!' : 'Who are you?';

        return (
            <div>
                <div>{userMessage}</div>
                <this.props.activeRouteHandler />
            </div>
        );
    },
    onChange: function () {
        this.setState(getStateFromStores());
    }
});

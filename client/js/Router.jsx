/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.Routes;
var MainLayout = require('./components/MainLayout.jsx');
var HomePage   = require('./components/HomePage.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <Routes location="history">
                <Route path="/app" handler={MainLayout}>
                    <DefaultRoute handler={HomePage} />
                </Route>
            </Routes>
        );
    }
});

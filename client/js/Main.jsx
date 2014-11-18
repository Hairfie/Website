/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.Routes;
var MainLayout = require('./components/MainLayout.jsx');
var HomePage   = require('./components/HomePage.jsx');

React.render(
    <Routes location="history">
        <Route path="/app" handler={MainLayout}>
            <DefaultRoute handler={HomePage} />
        </Route>
    </Routes>,
    document.getElementById('app')
);

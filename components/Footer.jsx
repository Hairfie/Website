/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('./UserStatus.jsx');

module.exports = React.createClass({
    render: function () {

        return (
            <footer>
                <div className="container">
                    <a className="social" href="https://www.facebook.com/pages/Hairfie/1507026002849084" target="_blank"><img src="/img/facebook@2x.png" /></a>
                    <a className="social" href="https://instagram.com/HairfieApp" target="_blank"><img src="/img/instagram@2x.png" /></a>
                    <a className="social" href="https://twitter.com/HairfieApp" target="_blank"><img src="/img/twitter@2x.png" /></a>
                    <a className="social" href="mailto:hello@hairfie.com" target="_blank"><img src="/img/mail@2x.png" /></a>
                    <a className="social" href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank"><img src="/img/btn-apple@2x.png" /></a>
                </div>
            </footer>
        );
    }
});
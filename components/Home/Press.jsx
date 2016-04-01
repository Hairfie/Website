'use strict';

var React = require('react');
var Picture = require('../Partial/Picture.jsx');

var Press = React.createClass({
    render: function () {
        return (
            <section className="home-section press">
                <h2>Ils parlent de nous&nbsp;!</h2>
                <div className="flex-container">
                    <Picture picture={{url: "/img/home/m6.png"}} />
                    <Picture picture={{url: "/img/home/leparisien.gif"}} />
                    <Picture picture={{url: "/img/home/coiffuredeparis.png"}} />
                    <Picture picture={{url: "/img/home/maddyness.png"}} />
                </div>
            </section>
       );
    },
});

module.exports = Press;
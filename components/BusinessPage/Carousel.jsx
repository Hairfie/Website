/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        var items = _.map(this.props.pictures, function (picture, i) {
            var cls = (i == 0) ? "item active" : "item";
            return (
                <div className={cls}>
                    <Picture picture={picture} options={{flags:['lossy']}} backgroundStyle={true} />
                </div>
            );
        });

        if (items.length == 0) items.push(<div className="item active" />);

        return (
            <div id="carousel-salon" className="carousel slide" data-ride="carousel" data-interval="false">
                <div className="carousel-inner" role="listbox">
                    {items}
                </div>
                <a className="left carousel-control" href="#carousel-salon" role="button" data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span className="sr-only">Précédent</span>
                </a>
                <a className="right carousel-control" href="#carousel-salon" role="button" data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span className="sr-only">Suivant</span>
                </a>
            </div>
        );
    }
});

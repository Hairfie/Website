'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');

module.exports = React.createClass({
    render: function () {
        var rating = this.props.rating;
        if (!rating) return <span />;

        rating = Math.round(rating / 100 * 5);
        var className = "stars ";
        if(this.props.min) className += ' min ';
        if(this.props.className) className += this.props.className;
        //"stars "+(this.props.min ? ' min' : '') + ' ' + (this.props.className || '')

        return (
            <div className={className} min={this.props.min} >
                {_.map([1, 2, 3, 4, 5], function (starValue) {
                    return <span key={starValue} className={'star'+(starValue <= rating ? ' full' : '')+(this.props.min ? ' min' : '')} />
                }, this)}
            </div>
        );
    }
});
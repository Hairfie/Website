/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');

var Carousel = require('react-bootstrap/Carousel');
var CarouselItem = require('react-bootstrap/CarouselItem');

module.exports = React.createClass({
    render: function () {
        return (
            <Carousel id="carousel-salon" className="carousel slide" indicators={false}>
                {_.map(this.props.pictures, function (picture, i) {
                    return (
                        <CarouselItem>
                            <Picture picture={picture} />
                        </CarouselItem>
                    );
                })}
            </Carousel>
        );
    }
});

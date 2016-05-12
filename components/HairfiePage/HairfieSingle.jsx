'use strict';

var React = require('react');
var Carousel = require('../Partial/Carousel.jsx');
var Link = require('../Link.jsx');
var _ = require('lodash');
var ReactFitText = require('react-fittext');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="col-xs-12 col-sm-6 hairfie-single-container">
                <span className="force-size"/>
                <Carousel id="carousel-hairfie" pictures={this.props.hairfie.pictures} indice={true} beforeAfter={this.props.hairfie.isBeforeAfter} alt={this.props.hairfie.tags.length > 0 ? _.map(this.props.hairfie.tags, 'name').join(", ") : ""}>
                    {this.renderPrice()}
                </Carousel>
                {this.renderBookingButton()}
            </div>
       );
    },
    renderBookingButton: function () {
        if (!this.props.hairfie.business) return;

        return (
            <div className="like-group">
                <div className="like-btn" onClick={this.props.likeHairfie.func}>
                    <a role="button">
                        <span className={"glyphicon glyphicon-heart" + (this.props.likeHairfie.state ? " red" : "")}></span>
                    </a>
                </div>
                <div className="cta">
                    <Link className="btn btn-book full" route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                        Prendre RDV
                    </Link>
                </div>
            </div>
        );
    },
    renderPrice: function () {
        if (!this.props.hairfie.price) return;
        return (
                <div className="pricetag">
                    <ReactFitText compressor={0.33} minFontSize={10}>
                        <span className="price">{this.props.hairfie.price.amount+'€'}</span>
                    </ReactFitText>
                </div>
            );

    }
});
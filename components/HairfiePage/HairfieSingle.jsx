'use strict';

var React = require('react');
var Carousel = require('../BusinessPage/Carousel.jsx');
var Link = require('../Link.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="col-xs-12 col-sm-6">
                <Carousel id="carousel-hairfie" pictures={this.props.hairfie.pictures} />
                {this.renderBookingButton()}
            </div>
       );
    },
    renderBookingButton: function () {
        if (!this.props.hairfie.business) return;

        return (
            <div className="like-group">
                <div className="like-btn" onClick={this.props.likeHairfie.func}>
                    <a>
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
    }
});
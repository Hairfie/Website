'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var Link = require('../Link.jsx');
var PriceRating = require('../Partial/PriceRating.jsx');
var Rating = require('../Partial/Rating.jsx');

var ShareButton = React.createClass({
    componentDidMount: function () {
        new window.Share('.share-hairfie', {
            ui: {
              button_text: "Partager",
              flyout: "bottom center"
              }});
    },
    render: function () {
        return (
                <div style={{display: 'inline-block'}} {...this.props}>
                    <div className="share-hairfie">
                    </div>
                </div>
            );
    }
});

module.exports = React.createClass({
    render: function() {
        if (!this.props.hairfie.business) return <div />;
        var hairdresserNode;
        if (this.props.hairfie.hairdresser) {
            hairdresserNode = (
                <p>Réalisé par :&nbsp;
                    <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                        {this.props.hairfie.hairdresser.firstName}
                    </Link>
                </p>
            );
        }

        var business = this.props.hairfie.business;
        var address = business.address || {};

        return (
            <div className="col-xs-12 col-sm-6">
                <div className="salon-infos">
                    <div className="row">
                        <div className="col-xs-3">
                            <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                                <Picture
                                    picture={_.first(this.props.hairfie.business.pictures)}
                                    options={{ width: 220, height: 220, crop: 'thumb' }}
                                    placeholder="/img/placeholder-640.png"
                                />
                            </Link>
                        </div>
                        <div className="col-xs-9">
                            <div className="address-bloc">
                                <h2>
                                    <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                                        {this.props.hairfie.business.name}
                                    </Link>
                                    <PriceRating className="pull-right hidden-xs" business={business} style={{fontSize: "1em"}}/>
                                </h2>
                                <p className="address">{address.street} {address.zipCode} {address.city}</p>
                                {hairdresserNode}          
                            </div>
                            <Rating style={{display: "inline-block"}} rating={business.rating} min={true}/>
                            { 
                            business.numReviews ? 
                                <p style={{display: "inline", verticalAlign: '8px'}}> - {business.numReviews} avis</p>
                                : null
                            }
                            <p className="more-info">
                                <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                                    {"+ d'infos sur le salon"}
                                </Link>
                            </p>
                            <p className="likes">
                                <a role="button" className={this.props.likeHairfie.state ? "red" : ""} onClick={this.props.likeHairfie.func}>
                                    <span className="glyphicon glyphicon-heart" /> {this.props.hairfie.numLikes} j'aime
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="description" style={{paddingTop: '20px'}}>
                     <div className="col-xs-12 tags">
                        { _.map(this.props.hairfie.tags, function(tag) {
                            return (<span className="tag" key={tag.id}><Link route="hairfie_search" params={{ address: 'Paris--France'}} query={{tags: tag.name}}>{tag.name}</Link></span>)
                        }) }
                    </div>
                </div>
            </div>
        );
    }
});
'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('./Picture.jsx');
var Link = require('../Link.jsx');

function displayName(u) { var u = u || {}; return u.firstName; }

module.exports = React.createClass({
    render: function () {
        var hairfie = this.props.hairfie;
        if (!hairfie) return null;

        if(!hairfie) return <div />;
        //TODO: DELETE HAIRDRESSER ?
        var hairdresser = <p></p>;
        if (hairfie.hairdresser) {
            hairdresser = <p><span className="underline">Coiffeur</span> : {displayName(hairfie.hairdresser)}</p>;
        }
        var salon = <p></p>;
        if (hairfie.business && hairfie.business.name) {
            salon = <p><span className="underline">Salon de coiffure :</span>  <br/> {hairfie.business.name}</p>;
        }

        var price;
        if (hairfie.price) {
            price = <div className="pricetag"><span>{hairfie.price.amount}€</span></div>;
        }

        var tags;
        if (hairfie.tags) {
            tags = <p>{_.map(hairfie.tags, function(tag) {
                return (<span className="hf-tag" key={tag.id}>{tag.name}</span> );
            })}</p>
        }

        return (
            <div key={hairfie.id} {...this.props}>
                <figure>
                    <Link route="hairfie" params={{ hairfieId: hairfie.id }}>
                        <Picture picture={_.last(hairfie.pictures)}
                                resolution={{width: 640, height: 640}}
                                placeholder="/img/placeholder-640.png"
                                alt={hairfie.tags.length > 0 ? _.map(hairfie.tags, 'name').join(", ") : ""}
                        />
                                {price}
                            <figcaption>
                                <div className="fig-text">
                                    {salon}
                                    <hr/>
                                    {tags}
                                </div>
                                {hairfie.pictures.length > 1 ? <Picture picture={_.first(hairfie.pictures)} style={{position: 'absolute', width:'20%', top: '15px', right: '15px'}} /> : null}
                            </figcaption>
                        </Link>
                    </figure>
                </div>
            );
    }
});
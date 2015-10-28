'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('./Picture.jsx');
var Link = require('../Link.jsx');

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }

module.exports = React.createClass({
    render: function () {
        var hairfie = this.props.hairfie;

        var hairdresser = <p></p>;
        if (hairfie.hairdresser) {
            hairdresser = <p><span className="underline">Coiffeur</span>: {displayName(hairfie.hairdresser)}</p>;
        }
        var salon = <p></p>;
        if (hairfie.business && hairfie.business.name) {
            salon = <p><span className="underline">Salon</span>: {hairfie.business.name}</p>;
        }

        var price;
        if (hairfie.price) {
            price = <div className="pricetag">{hairfie.price.amount}€</div>;
        }
        return (
            <div key={hairfie.id} {...this.props}>
                <figure>
                    <Link route="hairfie" params={{ hairfieId: hairfie.id }}>
                        <Picture picture={_.last(hairfie.pictures)}
                                resolution={{width: 640, height: 640}}
                                placeholder="/img/placeholder-640.png"
                                alt="" />
                            <figcaption>
                                {hairdresser}
                                {salon}
                                {price}
                                {hairfie.pictures.length > 1 ? <Picture picture={_.first(hairfie.pictures)} className="miniature" /> : null}
                            </figcaption>
                        </Link>
                    </figure>
                </div>
            );
    }
});
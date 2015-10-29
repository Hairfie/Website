'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var Link = require('../Link.jsx');
var HairfieActions = require('../../actions/HairfieActions');

var moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

var PAGE_SIZE = 12;

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }

module.exports = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function() {
        if (_.isUndefined(this.props.page) || this.props.page < 0)
            return this.renderLoader();

        return (
            <div className="hairfies">
                <div className="row">
                    {this.props.similarHairfies.length > 0 ? <h3 className="col-xs-12 text-center">Hairfies Similaires</h3> : ''}
                    {_.map(this.props.similarHairfies, function (hairfie) {
                        var hairdresser = <p>&nbsp;</p>;
                        if (hairfie.hairdresser) {
                            hairdresser = <p>Coiffé par <span>{displayName(hairfie.hairdresser)}</span></p>;
                        }
                        var price;
                        if (hairfie.price) {
                            price = <div className="pricetag">{hairfie.price.amount}€</div>;
                        }

                        return (
                            <div key={hairfie.id} className="col-xs-6 col-sm-3 col-lg-2 single-hairfie">
                                <figure>
                                    <Link route="hairfie" params={{ hairfieId: hairfie.id }}>
                                        <Picture picture={_.last(hairfie.pictures)}
                                                resolution={{width: 640, height: 640}}
                                                placeholder="/img/placeholder-640.png"
                                                alt="" />
                                        <figcaption>
                                            {hairdresser}
                                            <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                            {price}
                                        </figcaption>
                                    </Link>
                                </figure>
                            </div>
                        );
                    }, this)}
                </div>
                {this.renderMoreButton()}
            </div>
            );
    },
    renderLoader: function () {
        return (
            <div className="hairfies">
                <div className="row">
                    <div className="loading" />
                </div>
            </div>
        );
    },
    renderMoreButton: function () {
        if (this.props.page * PAGE_SIZE > this.props.similarHairfies.length) return;

        return <a role="button" onClick={this.loadMore} className="btn btn-red">Voir plus de Hairfies</a>;
    },
    loadMore: function (e) {
        if (e) e.preventDefault();
        this.context.executeAction(HairfieActions.loadSimilarHairfies, {
            hairfie: this.props.hairfie,
            page: (this.props.page || 0) + 1,
            pageSize: PAGE_SIZE
        });
    }
});
'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var HairdresserLayout = require('./HairdresserPage/Layout.jsx');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');

var moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

var PAGE_SIZE = 15;

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }

var HairdresserHairfiesPage = React.createClass({
    render: function () {
        if (_.isUndefined(this.props.page) || this.props.page < 0)
            return this.renderLoader();

        return(
            <HairdresserLayout hairdresser={this.props.hairdresser} tab="hairfies">
                {this.renderTitle()}
                <div className="hairfies">
                    <div className="row">
                    {_.map(this.props.hairfies, function (hairfie) {
                        var hairdresser = <p></p>;
                        if (hairfie.hairdresser) {
                            hairdresser = <p>Coiffé par <span>{displayName(hairfie.hairdresser)}</span></p>;
                        }

                        var price;
                        if (hairfie.price) {
                            price = <div className="pricetag">{hairfie.price.amount}€</div>;
                        }
                        return (
                            <div key={hairfie.id} className="col-xs-6 col-sm-4 col-md-3 single-hairfie">
                                <figure>
                                    <Link route="hairfie" params={{ hairfieId: hairfie.id }}>
                                        <Picture picture={_.last(hairfie.pictures)}
                                                resolution={{width: 640, height: 640}}
                                                placeholder="/images/placeholder-640.png"
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
            </HairdresserLayout>
        );
    },
    renderLoader: function () {
        return (
        <HairdresserLayout hairdresser={this.props.hairdresser} tab="hairfies">
            <div className="hairfies">
                <div className="row">
                    <div className="loading" />
                </div>
            </div>
        </HairdresserLayout>
        );
    },
    renderMoreButton: function () {
        if (this.props.page * PAGE_SIZE > this.props.hairfies.length) return;

        return <a role="button" onClick={this.loadMore} className="btn btn-red">Voir plus de Hairfies</a>;
    },
    loadMore: function (e) {
        if (e) e.preventDefault();
        this.context.executeAction(HairfieActions.loadHairdresserHairfies, {
            id: this.props.hairdresser.id,
            page: (this.props.page || 0) + 1,
            pageSize: PAGE_SIZE
        });
    },
    renderTitle: function () {
        if (_.isEmpty(this.props.hairfies))
            return <h3>{this.props.hairdresser.firstName} n'a pas encore d'Hairfie attribué.</h3>
        return <h3>Les Hairfies coiffés par {this.props.hairdresser.firstName}</h3>;
    }
});

HairdresserHairfiesPage = connectToStores(HairdresserHairfiesPage, [
    'HairdresserStore',
    'HairfieStore'
], function (context, props) {
    return {
        hairdresser: context.getStore('HairdresserStore').getById(props.route.params.id),
        hairfies: context.getStore('HairfieStore').getHairfiesByHairdresser(props.route.params.id),
        page: context.getStore('HairfieStore').getHairfiesByHairdresserPage(props.route.params.id)
    };
});

module.exports = HairdresserHairfiesPage;
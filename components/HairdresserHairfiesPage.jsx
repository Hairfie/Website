'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var HairdresserLayout = require('./HairdresserPage/Layout.jsx');
var HairfieActions = require('../actions/HairfieActions');
var Hairfie = require('./Partial/Hairfie.jsx');

var PAGE_SIZE = 10;

var HairdresserHairfiesPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        if (_.isUndefined(this.props.page) || this.props.page < 0)
            return this.renderLoader();

        return(
            <HairdresserLayout hairdresser={this.props.hairdresser} tab="hairfies">
                {this.renderTitle()}
                <div className="hairfies">
                    <div className="row">
                    {_.map(this.props.hairfies, function (hairfie) {
                        return <Hairfie hairfie={hairfie} className="col-xs-6 col-sm-4 col-md-3 single-hairfie" popup={true} hairfies={_.map(this.props.hairfies, 'id')} />
                    }.bind(this))}
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
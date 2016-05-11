'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('./Picture.jsx');
var Link = require('../Link.jsx');
var PopUpHairfie = require('./PopUpHairfie.jsx');
var NavigationActions = require('../../actions/NavigationActions');

function displayName(u) { var u = u || {}; return u.firstName; }

module.exports = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func,
        getStore: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            popup: false,
            hairfieId: null
        };
    },
    componentDidMount: function() {
        this.setState({
            defaultUrl: window.location.pathname
        });
    },
    render: function () {
        var hairfie = this.props.hairfie;

        if (!hairfie) return null;
        return (
            <div key={hairfie.id} {...this.props}>
                <div className={"hidden-xs hidden-sm shadow " + (this.state.popup ? 'active' : 'inactive')} onClick={this.openPopup}/>
                {this.state.popup ? <PopUpHairfie hairfieId={this.state.hairfieId} prev={this.prev} next={this.next} close={this.openPopup} /> : null}
                <figure onClick={this.openPopup.bind(null, hairfie.id)}>
                    {this.renderLink(true, 'hidden-xs')}
                    {this.renderLink(true, ' hidden-sm hidden-md hidden-lg')}
                </figure>
            </div>
        );
    },
    renderLink: function (noNav, className) {
        var hairfie = this.props.hairfie;
        var salon = null;

        if (hairfie.business && hairfie.business.name) {
            salon = (
                <div className='infos'>
                    <span className="business-title">Salon de coiffure&nbsp;:</span>
                    <span className="business-name">{hairfie.business.name}</span>
                </div>
            );
        }

        return (
            <Link route="hairfie" params={{ hairfieId: hairfie.id }} noNav={this.props.popup ? noNav : false} className={className}>
                <Picture picture={_.last(hairfie.pictures)}
                    resolution={{width: 320, height: 320}}
                    placeholder="/img/placeholder-220.png"
                    alt={hairfie.tags.length > 0 ? _.map(hairfie.tags, 'name').join(", ") : ""}
                />
                {hairfie.pictures.length > 1 ? <Picture picture={_.first(hairfie.pictures)} className='hairfie-min' /> : null}

                <figcaption>
                    {salon}
                </figcaption>
                <div className='infos-mobile visible-xs'>
                    <span className="business-title">Salon de coiffure&nbsp;:</span>
                    <br/>
                    <span className="business-name">
                       {hairfie.business && hairfie.business.name}
                    </span>
                </div>
            </Link>
        )
    },
    openPopup: function (hairfieId, e) {
        if (!this.props.popup) return;
        if (this.state.popup) {
            window.history.replaceState("", "", this.state.defaultUrl);
        }

        this.setState({
            hairfieId: hairfieId || null,
            popup: !this.state.popup
        }, function() {
            this.state.popup ? document.body.classList.add('locked') : document.body.classList.remove('locked');
        });
    },
    prev: function () {
        var hairfies = this.props.hairfies;
        var index = _.indexOf(hairfies, this.state.hairfieId);

        if (index > 0) {
            return this.navigate(hairfies[(index - 1)]);
        }
        else {
            return this.navigate(hairfies[(hairfies.length - 1)]);
        }
    },
    next: function () {
        var hairfies = this.props.hairfies;
        var index = _.indexOf(hairfies, this.state.hairfieId);
        if (index > this.props.hairfies.length - 4) {
            this.props.loadMore();
        } 
        if (index < (hairfies.length - 1)) {
            return this.navigate(hairfies[(index + 1)]);
        }
        else {
            return this.navigate(hairfies[0]);
        }
    },
    navigate: function(hairfieId) {
        this.setState({
            hairfieId: hairfieId
        });

        var url = this.context.getStore('RouteStore').makeUrl("hairfie", {hairfieId: hairfieId});
        return window.history.replaceState("", "", url);
    }
});
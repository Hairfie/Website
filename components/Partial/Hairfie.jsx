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

        var hairdresser = <p></p>;
        if (hairfie.hairdresser) {
            hairdresser = <p><span className="underline">Coiffeur</span> : {displayName(hairfie.hairdresser)}</p>;
        }
        var salon = <p></p>;
        if (hairfie.business && hairfie.business.name) {
            salon = <p><span className="underline">Salon</span> : {hairfie.business.name}</p>;
        }

        var price;
        if (hairfie.price) {
            price = <div className="pricetag"><span className="price">{hairfie.price.amount + '€'}</span></div>;
        }

        var tags;
        if (hairfie.tags) {
            tags = <p>{_.map(hairfie.tags, 'name').join(', ')}</p>
        }

        return (
            <div key={hairfie.id} {...this.props}>
                <div className={"hidden-xs hidden-sm shadow " + (this.state.popup ? 'active' : 'inactive')} onClick={this.openPopup}/>
                {this.state.popup ? <PopUpHairfie hairfieId={this.state.hairfieId} className="hidden-xs hidden-sm" prev={this.prev} next={this.next} close={this.openPopup} /> : null}
                <figure onClick={this.openPopup.bind(null, hairfie.id)}>
                    <Link route="hairfie" params={{ hairfieId: hairfie.id }} noNav={this.props.popup} className="hidden-xs hidden-sm">
                        <Picture picture={_.last(hairfie.pictures)}
                                resolution={{width: 640, height: 640}}
                                placeholder="/img/placeholder-640.png"
                                alt={hairfie.tags.length > 0 ? _.map(hairfie.tags, 'name').join(", ") : ""}
                        />
                        {price}
                        <figcaption>
                            {salon}
                            {hairdresser}
                            {tags}    
                            {hairfie.pictures.length > 1 ? <Picture picture={_.first(hairfie.pictures)} style={{position: 'absolute', width:'40%', top: '0px', right: '0px'}} /> : null}
                        </figcaption>
                    </Link>
                    <Link route="hairfie" params={{ hairfieId: hairfie.id }} className="hidden-md hidden-lg">
                        <Picture picture={_.last(hairfie.pictures)}
                                resolution={{width: 640, height: 640}}
                                placeholder="/img/placeholder-640.png"
                                alt={hairfie.tags.length > 0 ? _.map(hairfie.tags, 'name').join(", ") : ""}
                        />
                        {price}
                        <figcaption>
                            {salon}
                            {hairdresser}
                            {tags}    
                            {hairfie.pictures.length > 1 ? <Picture picture={_.first(hairfie.pictures)} style={{position: 'absolute', width:'40%', top: '0px', right: '0px'}} /> : null}
                        </figcaption>
                    </Link>
                </figure>
            </div>
        );
    },
    openPopup: function (hairfieId, e) {
        if (!this.props.popup) return;
        if (this.state.popup) {
            window.history.replaceState("", "", this.state.defaultUrl);
        }
        this.setState({
            hairfieId: hairfieId || null,
            popup: !this.state.popup
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
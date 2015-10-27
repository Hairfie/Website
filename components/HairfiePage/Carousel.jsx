'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            displayIndex: 0
        };
    },
    componentWillReceiveProps: function () {
        this.setState({displayIndex: 0});
    },
    render: function () {
        var pictures = this.props.hairfie.pictures.slice(0, 2);

        return (
            <div id="carousel-hairfie" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner" role="listbox">
                    {_.map(pictures, function (picture, i) {
                        return (
                            <div key={i+'-'+picture.url} className={'item '+(this.state.displayIndex == i ? ' active' : '')}>
                                <div className="outer-img">
                                    <Picture picture={picture}/>
                                    {this.renderPrice()}
                                </div>
                            </div>
                        );
                    }, this)}
                </div>
                {this.renderControl('left', 0, 'Précédent')}
                {this.renderControl('right', 1, 'Suivant')}
            </div>
        );
    },
    renderPrice: function () {
        if (!this.props.hairfie.price) return;
        return (
                <div className="pricetag">
                    {this.props.hairfie.price.amount+'€'}
                </div>
            );

    },
    renderControl: function (position, index, label) {
        if (this.props.hairfie.pictures.length < 2) return;

        return (
            <a className={position+' carousel-control'} role="button" onClick={this.show.bind(this, index)}>
                <span className={'arrow arrow-'+position} aria-hidden="true" />
                <span className="sr-only">{label}</span>
            </a>
        );
    },
    show: function (i) {
        this.setState({displayIndex: i});
    }
});
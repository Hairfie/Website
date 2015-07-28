'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var Gallery = require('./Gallery.jsx');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            openGallery: false
        }
    },
    render: function () {
        var items = _.map(this.props.pictures, function (picture, i) {
            var cls = (i == 0) ? "item active" : "item";
            return (
                <div className={cls}>
                    <Picture picture={picture} backgroundStyle={true} onClick={this.openGallery} />
                </div>
            );
        }, this);

        if (items.length == 0) items.push(<div className="item active placeholder" />);
        return (
            <div id="carousel-salon" className="carousel slide" data-ride="carousel" data-interval="false">
                <div className="carousel-inner" role="listbox">
                    {items}
                </div>
                {this.renderControlLeft()}
                {this.renderControlRight()}
                {/*<Gallery pictures={this.props.pictures} isOpen={this.state.openGallery} onClose={this.handleCloseGallery} />*/}
            </div>
        );
    },
    renderControlLeft: function() {
        if(!this.props.pictures) return;
        return (
            <a onClick={this.openGallery} className="left carousel-control" href="#carousel-salon" role="button">
                <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                <span className="sr-only">Précédent</span>
            </a>
        );
    },
    renderControlRight: function() {
        if(!this.props.pictures) return;
        return (
            <a onClick={this.openGallery} className="right carousel-control" href="#carousel-salon" role="button">
                <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                <span className="sr-only">Suivant</span>
            </a>
        );
    },
    openGallery: function(e) {
        e.preventDefault();
        if(this.props.pictures) {
            this.setState({openGallery: true});
        }
    },
    handleCloseGallery: function () {
        this.setState({openGallery: false});
    }
});

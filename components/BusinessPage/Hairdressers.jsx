'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var Gallery = require('./Gallery.jsx');

function displayName(n) { return n.firstName+' '+(n.lastName || '').substr(0, 1)+'.' }
function initials(n) { return (n.firstName || '').substr(0, 1)+''+(n.lastName || '').substr(0, 1) }

var HairdresserPicture = React.createClass({
    render: function () {
        if (!this.props.hairdresser.picture) return this.renderDefault();

        return <Picture picture={this.props.hairdresser.picture}
                     options={{
                        width: 340,
                        height: 340,
                        crop: 'thumb',
                        gravity: 'faces'
                     }}
                    placeholder="/images/placeholder-640.png"
                            alt={this.getAlt()} onClick={this.props.openGallery} />;
    },
    renderDefault: function () {
        return <img src={'http://placehold.it/120x120&text='+initials(this.props.hairdresser)} alt={this.getAlt()} />;
    },
    getAlt: function () {
        return 'Photo de '+displayName(this.props.hairdresser);
    }
});

module.exports = React.createClass({
    getInitialState: function () {
        return {
            openGallery: false
        }
    },
    render: function () {
        var pictures = [];
        var items = _.map(this.props.hairdressers, function (hairdresser, i) {
            pictures.push(hairdresser.picture);
            return (
                <div key={hairdresser.id} className="col-sm-3 col-xs-6 coiffeur">
                    <HairdresserPicture hairdresser={hairdresser} openGallery={this.openGallery} />
                    <p className="text-center">{hairdresser.firstName} {(hairdresser.lastName || '').substr(0, 1)}.</p>
                </div>
            );
        }, this);
        console.log(this, pictures);

        return (
            <div id="carousel-salon" className="carousel slide" data-ride="carousel" data-interval="false">
                <div id="hairdressers" role="listbox">
                    {items}
                </div>
                <Gallery pictures={pictures} isOpen={this.state.openGallery} onClose={this.handleCloseGallery} />
            </div>
        );
    },
/*    renderControlLeft: function() {
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
    },*/
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

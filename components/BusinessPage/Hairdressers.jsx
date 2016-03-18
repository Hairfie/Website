'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var Gallery = require('../Partial/Gallery.jsx');
var Link = require('../Link.jsx');

function displayName(n) { return n.firstName+' '+(n.lastName || '').substr(0, 1)+'.' }
function initials(n) { return (n.firstName || '').substr(0, 1)+''+(n.lastName || '').substr(0, 1) }

var HairdresserPicture = React.createClass({
    render: function () {
        if (!this.props.hairdresser.picture) return this.renderDefault();

        return <Picture role="button" picture={this.props.hairdresser.picture}
                     options={{
                        width: 220,
                        height: 220,
                        crop: 'thumb',
                        gravity: 'faces'
                     }}
                    placeholder="/img/placeholder-640.png"
                            alt={this.getAlt()} {...this.props} />;
    },
    renderDefault: function () {
        return <img src={'https://placehold.it/120x120&text='+initials(this.props.hairdresser)} alt={this.getAlt()} />;
    },
    getAlt: function () {
        return 'Photo de '+displayName(this.props.hairdresser);
    }
});

module.exports = React.createClass({
    getInitialState: function () {
        return {
            openGallery: false,
            index: 0
        }
    },
    render: function () {
        var pictures = _.map(this.props.hairdressers, function(hairdresser) {
            return hairdresser.picture;
        });
        var titles = _.map(this.props.hairdressers, function(hairdresser) {
            if (!hairdresser.picture) return;
            return displayName(hairdresser);
        });
        var index = -1;
        var items = _.map(this.props.hairdressers, function (hairdresser) {
            if (hairdresser.picture)
                index++;
            return (
                <div key={hairdresser.id} className="col-sm-2 col-xs-4 coiffeur">
                    <HairdresserPicture hairdresser={hairdresser} onClick={this.openGallery.bind(null, index)} />
                    <Link route="hairdresser" params={{id: hairdresser.id}} className="black"><p className="text-center">{hairdresser.firstName} {(hairdresser.lastName || '').substr(0, 1)}.</p></Link>
                </div>
            );
        }, this);
        pictures = _.compact(pictures);
        titles = _.compact(titles);
        return (
            <div id="carousel-salon" className="carousel slide" data-ride="carousel" data-interval="false">
                <div id="carousel-inner" role="listbox">
                    {items}
                </div>
                <Gallery pictures={pictures} isOpen={this.state.openGallery} onClose={this.handleCloseGallery} titles={titles} index={this.state.index} />
            </div>
        );
    },
    openGallery: function(index, e) {
        e.preventDefault();
        if(this.props.hairdressers) {
            this.setState({
                openGallery: true,
                index: index
            });
        }
    },
    handleCloseGallery: function () {
        this.setState({openGallery: false});
    }
});

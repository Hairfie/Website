'use strict';

var React = require('react');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');
var Gallery = require('../Partial/Gallery.jsx');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            openGallery: false,
            displayIndex: 0
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if(this.props.pictures != nextProps.pictures)
            this.setState({displayIndex: 0});
    },
    render: function () {
        var gallery = this.props.gallery ? <Gallery pictures={this.props.pictures} isOpen={this.state.openGallery} onClose={this.handleCloseGallery} /> : '';

        var items = _.map(this.props.pictures, function (picture, i) {
            var cls = (i == this.state.displayIndex) ? "item active" : "item";
            return (
                <div className={cls} key={picture.id}>
                    <Picture picture={picture} role={this.props.gallery || (this.state.displayIndex != i) ? "button" : ''} backgroundProps={this.props.backgroundProps} backgroundStyle={this.props.backgroundStyle || false} onClick={this.props.gallery ? this.openGallery : this.move.bind(null, i)} alt={this.props.alt}/>
                    {this.props.children}
                </div>
            );
        }, this);
        if (items.length == 0) items.push(<div className="item active placeholder" />);

        return (
            <div {...this.props} className={"carousel slide" + (this.props.className ? (" " + this.props.className) : "")} data-ride="carousel" data-interval="false">
                <div className="carousel-inner" role="listbox">
                    {items}
                </div>
                {this.renderIndice()}
                {this.renderBeforeAfter()}
                {gallery}
            </div>
        );
    },
    componentDidUpdate: function() {
        if(typeof window !== 'undefined') {
            window.dispatchEvent(new Event('resize'));
        }
    },
    renderIndice: function() {
        if (!this.props.pictures || this.props.pictures.length < 2 || !this.props.indice) return null;
        return (
        <div className="indice-control">
            {_.map(this.props.pictures, function(picture, i) {
                return (
                    <a role="button" className={this.state.displayIndex == i ? "active" : ""} onClick={this.move.bind(null, i)} key={picture.id}>
                        <span className="arrow" />
                    </a>
                );
            }, this)}
        </div>
        );
    },
    renderBeforeAfter: function() {
        if (!this.props.pictures || this.props.pictures.length < 2 || !this.props.beforeAfter) return null;
        else if (this.state.displayIndex == 0) {
            return <p className="before">Avant</p>;
        }
        else {
            return <p className="after">Après</p>;
        }
    },
    handleLeftClick: function(e) {
        if(this.props.gallery) {
            this.openGallery(e);
        } else {
            this.previous(e);
        }
    },
    handleRightClick: function(e) {
        if(this.props.gallery) {
            this.openGallery(e);
        } else {
            this.next(e);
        }
    },
    previous: function(e) {
        e.preventDefault();
        if (this.state.displayIndex > 0) {
            var previous = this.state.displayIndex - 1;
        }
        else {
            var previous = this.props.pictures.length - 1;
        }
        this.setState({displayIndex: previous});
    },
    next: function(e) {
        e.preventDefault();
        if (this.state.displayIndex < (this.props.pictures.length - 1)) {
            var next = this.state.displayIndex + 1;
        }
        else {
            var next = 0;
        }
        this.setState({displayIndex: next});
    },
    move: function(move, e) {
        e.preventDefault();
        this.setState({displayIndex: move});
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

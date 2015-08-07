'use strict';

var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    getDefaultProps: function () {
        onClose: _.noop
    },
    componentDidMount: function() {
        if(this.props.isOpen) this.startGallery(this.props.index);
    },
    componentWillReceiveProps: function(nextProps) {
        if(!this.props.isOpen && nextProps.isOpen) this.startGallery(nextProps.index);
    },
    startGallery: function(index) {
        var links = _.map(this.props.pictures, function(picture) {
            return {
                href: picture.url,
                title: picture.title,
            };
        });
        var options = {
            index: index || 0,
            onclosed: this.onClose,
            onslide: function (index, slide) {
                if (!this.props.titles) return;
                var title = document.getElementById('blueimp-gallery').getElementsByClassName('title')[0];
                title.appendChild(document.createTextNode(this.props.titles[index]));
                }.bind(this)
            };
        blueimp.Gallery(links, options);
    },
    render: function () {
        return (
            <div id="blueimp-gallery" className="blueimp-gallery blueimp-gallery-controls">
                <div className="slides"></div>
                <h3 className="title"></h3>
                <p className="description"></p>
                <a className="prev">‹</a>
                <a className="next">›</a>
                <a className="close">×</a>
                <ol className="indicator"></ol>
                <div className="modal fade">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" aria-hidden="true">&times;</button>
                                <h4 className="modal-title"></h4>
                            </div>
                            <div className="modal-body next"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    onClose: function () {
        this.props.onClose();
    }
});

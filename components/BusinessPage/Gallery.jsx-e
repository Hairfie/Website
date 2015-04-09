/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    componentDidMount: function() {
        if(this.props.isOpen) this.startGallery();
    },
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.isOpen) this.startGallery();
    },
    startGallery: function() {
        var links = _.map(this.props.pictures, 'url');
        var options = {};
        var options = {
            onclosed: function() {

            },
            onOpened: function() {

            }
        };
        blueimp.Gallery(links, options);
    },
    render: function () {
        return (
            <div id="blueimp-gallery" className="blueimp-gallery blueimp-gallery-controls">
                <div className="slides"></div>
                <h3 className="title"></h3>
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
    }
});

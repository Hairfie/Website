/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var Layout = require('./ProLayout.jsx');
var _ = require('lodash');

var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getBusiness()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business;
        var pictureNodes = business.pictures.map(function(picture) {
            return this.renderPicture(picture);
        }, this);

        pictureNodes.push(this.renderNewPicture());

        return (
            <Layout context={this.props.context} business={business}>
                <h2>Photos du salon</h2>
                {pictureNodes}
            </Layout>
        );
    },
    renderPicture: function(picture) {
        return (
            <div className="col-sm-6 col-md-4 business-item" key={picture.url}>
                <div className="thumbnail">
                    <img src={picture.url} className="img-responsive" />
                </div>
            </div>
        );
    },
    renderNewPicture: function() {
        return (
            <div className="col-sm-6 col-md-4 business-item">
                <div className="thumbnail">
                    <input className="btn btn-primary" type="file" accept="image/*" ref="newPhoto" onChange={this.handleChange} />
                </div>
            </div>
        );
    },
    onChange: function() {
        this.setState(this.getStateFromStores());
    },
    handleChange: function(event) {
        console.log("handleChange() fileName = " + event.target.files[0].name);
        console.log("handleChange() file handle = " + event.target.files[0]);
        this._uploadPicture(event.target.files[0]);
    },
    _uploadPicture: function(file) {
        this.props.context.executeAction(BusinessActions.AddPicture, {
            pictureToUpload: file
        });
    }
});

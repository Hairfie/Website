/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../stores/BusinessStore');
var PictureUploadStore = require('../stores/PictureUploadStore');
var BusinessActions = require('../actions/Business');
var PictureActions = require('../actions/Picture');
var Layout = require('./ProLayout.jsx');
var _ = require('lodash');
var Uuid = require('uuid');

var Button = require('react-bootstrap/Button');

var Picture = React.create

var NewPicture = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [PictureUploadStore]
    },
    getInitialState: function () {
        return {
            uploadId: null
        };
    },
    onChange: function () {
        if (!this.state.uploadId) return;

        var upload = this.getStore(PictureUploadStore).getById(this.state.uploadId);

        if (!upload || upload.finished) {
            this.setState({uploadId: null});
            this.props.onPictureUploaded(upload.picture);
        }
    },
    render: function () {
        if (this.state.uploadId) {
            return this.renderUploading();
        }

        return (
            <div className="col-sm-6 col-md-4 business-item">
                <div className="thumbnail">
                    <span className="btn add-file">
                        <input type="file" accept="image/*" ref="file" value={this.state.fileInput} onChange={this.upload} />
                        <div className="clearfix" />
                    </span>
                </div>
            </div>
        );
    },
    renderUploading: function () {
        return (
            <div className="col-sm-6 col-md-4 business-item">
                <div className="thumbnail">
                    Upload en cours...
                </div>
            </div>
        );
    },
    upload: function (e) {
        e.preventDefault();

        var uploadId = Uuid.v4();

        this.executeAction(PictureActions.Upload, {
            id          : uploadId,
            container   : 'business-pictures',
            file        : e.target.files[0]
        });

        this.setState({uploadId: uploadId});
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getById(this.props.route.params.businessId),
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.state.business || {};
        var pictureNodes = _.map(business.pictures || [], function(picture) {
            return this.renderPicture(picture);
        }, this);

        pictureNodes.push(<NewPicture onPictureUploaded={this._addPicture} context={this.props.context} />);

        return (
            <Layout context={this.props.context} business={business} customClass={'business-photos'}>
                <h2>Photos du salon</h2>
                {pictureNodes}
            </Layout>
        );
    },
    renderPicture: function(picture) {
        if (picture.name) {
            var button = <button className="btn btn-danger btn-block" role="button" onClick={this._removePicture.bind(this, picture)}>Supprimer</button>;
        } else {
            var button = <button className="btn btn-warning btn-block" disabled>Photo par défaut</button>;
        }

        return (
            <div className="col-sm-6 col-md-4 business-item" key={picture.url}>
                <div className="thumbnail">
                    <img src={picture.url} className="img-responsive" />
                    <div className="caption">
                        {button}
                    </div>
                </div>
            </div>
        );
    },
    onChange: function() {
        this.setState(this.getStateFromStores());
    },
    _removePicture: function (picture) {
        this.executeAction(BusinessActions.RemovePicture, {
            business: this.state.business,
            picture : picture
        });
    },
    _addPicture: function(picture) {
        this.executeAction(BusinessActions.AddPicture, {
            business: this.state.business,
            picture : picture
        });
    }
});

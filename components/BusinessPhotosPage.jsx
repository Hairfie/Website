/** @jsx React.DOM */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var Layout = require('./ProLayout.jsx');
var _ = require('lodash');

var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business: this.getStore(BusinessStore).getById(this.props.route.params.businessId),
            loading: this.getStore(BusinessStore).isUploadInProgress(),
            fileInput: null
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

        pictureNodes.push(this.renderNewPicture());

        return (
            <Layout business={business} customClass={'business-photos'}>
                <h2>Photos du salon</h2>
                {pictureNodes}
            </Layout>
        );
    },
    renderPicture: function(picture) {
        if(picture.name) {
            var button = (<button className="btn btn-danger btn-block" role="button" onClick={this.deletePicture.bind(this, picture)}>Supprimer</button>)
        } else {
            var button = (<button className="btn btn-warning btn-block" disabled>Photo par défaut</button>)
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
    renderNewPicture: function() {
        if (this.state.loading) {
            return (
                <div className="col-sm-6 col-md-4 business-item">
                    <div className="thumbnail">
                        Upload en cours
                    </div>
                </div>
            );
        } else {
            return (
                <div className="col-sm-6 col-md-4 business-item">
                    <div className="thumbnail">
                        <span className="btn add-file">
                            <input type="file" accept="image/*" ref="newPhoto" value={this.state.fileInput} onChange={this.handleChange} />
                            <div className="clearfix" />
                        </span>
                    </div>
                </div>
            );
        }
    },
    onChange: function() {
        this.setState(this.getStateFromStores());
    },
    handleChange: function(event) {
        this.setState({fileInput: event.target.value, business: this.state.business});
        this._uploadPicture(event.target.files[0]);
    },
    deletePicture: function (pictureToDelete) {
        var pictures = _.reduce(this.state.business.pictures, function(arr, picture) {
            if(picture.name != pictureToDelete.name) {
                arr.push(picture.name);
            }
            return arr;
        }, []);

        this.executeAction(BusinessActions.Save, {
            business: {
                id          : this.state.business.id,
                pictures    : pictures
            }
        });
    },
    _uploadPicture: function(file) {
        this.executeAction(BusinessActions.AddPicture, {
            pictureToUpload: file,
            business: this.state.business
        });
    },

});

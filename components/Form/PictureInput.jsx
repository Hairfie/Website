/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible').StoreMixin;
var PictureUploadStore = require('../../stores/PictureUploadStore');
var PictureActions = require('../../actions/Picture');
var Uuid = require('uuid');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [PictureUploadStore]
    },
    propTypes: {
        container: React.PropTypes.string.isRequired
    },
    getStateFromStores: function () {
        var uploadId = this.state && this.state.uploadId,
            upload   = this.getStore(PictureUploadStore).getById(uploadId);

        var state = {};
        state.uploading = upload && !upload.finished;
        state.progressPercent = upload && upload.percent;

        // only replace state's picture when upload is finished
        if (upload && upload.finished) {
            state.picture = upload.picture;
        }

        return state;
    },
    getInitialState: function () {
        var state = this.getStateFromStores();

        // initialize with default picture
        state.picture = state.picture || this.props.defaultPicture;

        return state;
    },
    render: function () {
        var picture;
        if (this.state.picture) {
            picture = <Picture picture={this.state.picture} width={50} height={50} />;
        } else {
            picture = <div style={{width:'50px', height:'50px'}} />;
        }

        var action;
        if (this.state.uploading) {
            action = <p>Envoi en cours... ({this.state.progressPercent}%)</p>;
        } else if (this.state.picture) {
            action = <Button onClick={this.chooseFile}>Remplacer la photo</Button>;
        } else {
            action = <Button onClick={this.chooseFile}>Sélectionner une photo</Button>;
        }

        return (
            <Input {...this.props}>
                <div className="formControl">
                    <div className="media">
                        <div className="media-left">
                            <div className="media-object thumbnail">
                                {picture}
                            </div>
                        </div>
                        <div className="media-body">
                            {action}
                        </div>
                    </div>
                    <input ref="file" type="file" accept="image/*" className="hidden" onChange={this.upload} />
                </div>
            </Input>
        );
    },
    chooseFile: function (e) {
        e.preventDefault();
        this.refs.file.getDOMNode().click();
    },
    upload: function (e) {
        e.preventDefault();

        var uploadId = Uuid.v4();

        this.props.context.executeAction(PictureActions.Upload, {
            id          : uploadId,
            container   : this.props.container,
            file        : e.target.files[0]
        });

        this.setState({uploadId: uploadId});
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    getPicture: function () {
        return this.state.picture;
    }
});
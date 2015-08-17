'use strict';

var React = require ('react');
var _ = require ('lodash');
var UploadActions = require ('../../actions/UploadActions');
var Uuid = require ('uuid');
var Picture = require ('./Picture.jsx');

var UploadProgress = React.createClass({
    defaultProps: {
        onEnd: _.noop
    },
    contextTypes: {
        getStore: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            finished: false,
            percent: 0,
            onEnd: _.once(this.props.onEnd)
        };
    },
    componentWillMount: function () {
        this.context.getStore('UploadStore').addChangeListener(this.onStoreChange);
        this.setState(this.getStateFromStores());
    },
    componentWillUnmount: function () {
        this.context.getStore('UploadStore').removeChangeListener(this.onStoreChange);
    },
    getStateFromStores: function() {
        var upload = this.context.getStore('UploadStore').getById(this.props.uploadId) || {};

        var finished = upload.finished || false;
        var percent  = upload.percent || 0;

        return {
            finished: finished,
            percent : percent
        };
    },
    onStoreChange: function () {
        this.setState(this.getStateFromStores(), function () {
            if (this.state.finished) {
                var upload = this.context.getStore('UploadStore').getById(this.props.uploadId);
                this.state.onEnd(upload);
            }
        }.bind(this));
    },
    render: function() {
        var percent = this.state.percent;

        if (percent == 100) {
            return <p>On tient le bon bout, encore quelques instants...</p>;
        }

        return  <p>{'Envoi en cours ('+parseInt(percent)+'%)...'}</p>;
    }
});

var ImageField = React.createClass ({
    onChange: {
        onEnd: _.noop
    },
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function() {
        return {
            image: this.props.defaultPicture || null,
            uploadId: null
        };
    },
    render: function() {
        var styles = {
            imageField: {
                padding: '10px'
            },
            thumb: {
                width: '50px',
                height: '50px',
                background: '#fafafa',
                float: 'left',
                marginRight: '10px'
            }
        };
        return (
            <div style={styles.imageField}>
                <div style={styles.thumb}>
                    {this.renderThumb()}
                </div>
                <div className="infos">
                    {this.renderInfos()}
                </div>
                <div style={{ clear: 'both' }}></div>
                <input ref="input" type="file" accept="image/jpeg" style={{ display: 'none' }} onChange={this.upload} />
            </div>
        );
    },
    renderThumb: function() {
        var options = { width: 50, height: 50, crop: 'thumb' };
        if (this.state.image) {
            return <Picture picture={this.state.image} options={options} />;
        }
        return;
    },
    renderInfos: function() {
        if (this.state.uploadId)
            return <UploadProgress ref="upload" uploadId={this.state.uploadId} onEnd={this.onUploadEnd} />;
        else if (this.state.image)
            return <a role="button" onClick={this.chooseFile}>Remplacer la photo</a>;
        else
            return <a role="button" onClick={this.chooseFile}>Sélectionner une photo {this.props.text}</a>;
    },
    getImage: function() {
        return this.state.image;
    },
    chooseFile: function(e) {
        e.preventDefault();
        React.findDOMNode(this.refs.input).click();
    },
    upload: function(e) {
        var uploadId = Uuid.v4();
        var container = this.props.container;
        var file = e.target.files[0];

        this.context.executeAction(UploadActions.uploadImage, { uploadId: uploadId, container: container, file: file });
        this.setState({ uploadId: uploadId });
    },
    onUploadEnd: function (upload) {
        this.setState({ uploadId: null });
        this.setState({image: upload.image});
    }
});

module.exports = ImageField;

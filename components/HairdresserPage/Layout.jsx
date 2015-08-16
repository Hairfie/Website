'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../../lib/connectToStores');
var PublicLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var UserProfilePicture = require('../Partial/UserProfilePicture.jsx');
var Gallery = require('../Partial/Gallery.jsx');

var HairdresserLayout = React.createClass({
    getInitialState: function () {
        return {
            openGallery: false
        }
    },
    render: function() {
        if (!this.props.hairdresser) return (<PublicLayout />);
        var options = {
            width: 340,
            height: 340,
            crop: 'thumb',
            gravity: 'faces'
        };
        return (
            <PublicLayout>
                <div className="container user" id="content">
                    <div className="main-content">
                        <div className="short-info">
                            <div className="col-xs-4">
                                <Gallery pictures={this.props.hairdresser.picture} isOpen={this.state.openGallery} onClose={this.handleCloseGallery} />
                                <UserProfilePicture className="ProfilePicture" role={this.props.hairdresser.picture ? "button" : ""} onClick={this.props.hairdresser.picture ? this.openGallery : ""} picture={this.props.hairdresser.picture} options={options} gender={this.props.hairdresser.gender}/>
                            </div>
                            <div className="col-xs-8">
                                <h1>{this.props.hairdresser.firstName}</h1>
                                {this.renderEdit()}
                            </div>
                        </div>
                        <section className="user-content">
                            <div className="row">
                                <ul className="nav nav-tabs" role="tablist">
                                    <li className={'col-xs-4'+('hairfies' === this.props.tab ? ' active' : '')}>
                                        <Link route="hairdresser" params={{userId: this.props.hairdresser.id}} preserveScrollPosition={true}>
                                            <span className="icon-nav"></span>
                                            Infos
                                        </Link>
                                    </li>
                                    <li className={'col-xs-4'+('reviews' === this.props.tab ? ' active' : '')}>
                                        <Link route="hairdresser_hairfies" params={{userId: this.props.hairdresser.id}} preserveScrollPosition={true}>
                                            <span className="icon-nav"></span>
                                            Hairfies
                                        </Link>
                                    </li>
                                </ul>
                            <section>
                            {this.props.children}
                            </section>
                            </div>
                        </section>
                    </div>
                </div>
            </PublicLayout>
        );
    },
    openGallery: function(e) {
        e.preventDefault();
        if (this.props.user.picture)
            this.setState({openGallery: true});
    },
    handleCloseGallery: function () {
        this.setState({openGallery: false});
    }
});

HairdresserLayout = connectToStores(UserLayout, [
    'AuthStore',
    'UserStore'
], function (stores, props) {
    var token = stores.AuthStore.getToken();
    return {
        currentUser: stores.UserStore.getById(token.userId)
    };
});

module.exports = UserLayout;
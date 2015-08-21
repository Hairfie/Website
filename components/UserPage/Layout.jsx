'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PublicLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var UserProfilePicture = require('../Partial/UserProfilePicture.jsx');
var Gallery = require('../Partial/Gallery.jsx');

var UserLayout = React.createClass({
    getInitialState: function () {
        return {
            openGallery: false
        }
    },
    render: function() {
        if (!this.props.user) return (<PublicLayout />);
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
                                <Gallery pictures={this.props.user.picture} isOpen={this.state.openGallery} onClose={this.handleCloseGallery} />
                                <UserProfilePicture className="ProfilePicture" role={this.props.user.picture ? "button" : ""} onClick={this.props.user.picture ? this.openGallery : ""} picture={this.props.user.picture} options={options} gender={this.props.user.gender}/>
                            </div>
                            <div className="col-xs-8">
                                <h1>{this.props.user.firstName}</h1>
                                {this.renderEdit()}
                            </div>
                        </div>
                        <section className="user-content">
                            <div className="row">
                                <ul className="nav nav-tabs" role="tablist">
                                    <li className={'col-xs-4'+('hairfies' === this.props.tab ? ' active' : '')}>
                                        <Link route="user_hairfies" params={{userId: this.props.user.id}} preserveScrollPosition={true}>
                                            <span className="icon-nav"></span>
                                            Mes Hairfies
                                        </Link>
                                    </li>
                                    <li className={'col-xs-4'+('reviews' === this.props.tab ? ' active' : '')}>
                                        <Link route="user_reviews" params={{userId: this.props.user.id}} preserveScrollPosition={true}>
                                            <span className="icon-nav"></span>
                                            Mes Avis
                                        </Link>
                                    </li>
                                    <li className={'col-xs-4'+('likes' === this.props.tab ? ' active' : '')}>
                                        <Link route="user_likes" params={{userId: this.props.user.id}} preserveScrollPosition={true}>
                                            <span className="icon-nav"></span>
                                            Mes Likes
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
    renderEdit: function() {
        if (this.props.user.id == this.props.currentUser.id)
            return (<Link style={{marginBottom: '5px'}} className="green" route="user_edit">(Modifier mon profil)</Link>);
        return {};
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

UserLayout = connectToStores(UserLayout, [
    'AuthStore',
    'UserStore'
], function (context, props) {
    var token = context.getStore('AuthStore').getToken();
    return {
        currentUser: context.getStore('UserStore').getById(token.userId)
    };
});

module.exports = UserLayout;
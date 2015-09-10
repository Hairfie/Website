'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var PublicLayout = require('../PublicLayout.jsx');
var Link = require('../Link.jsx');
var UserProfilePicture = require('../Partial/UserProfilePicture.jsx');
var Gallery = require('../Partial/Gallery.jsx');
var Picture = require('../Partial/Picture.jsx');

function displayName(n) { return n.firstName+' '+(n.lastName || '').substr(0, 1)+'.' }

var HairdresserLayout = React.createClass({
    getInitialState: function () {
        return {
            openGallery: false
        }
    },
    render: function() {
        var fullName = displayName(this.props.hairdresser);
        if (!this.props.hairdresser) return (<PublicLayout />);
        var options = {
            width: 340,
            height: 340,
            crop: 'thumb',
            gravity: 'faces'
        };
        var background = this.props.hairdresser.picture ? <Picture className="short-background hairdresser" picture={this.props.hairdresser.picture} options={{effect: "blur:1000", height: 470, crop: "crop"}} placeholder="/images/placeholder-640.png" backgroundStyle={true}></Picture> : "";
        return (
            <PublicLayout>
            {background}
                <div className="container hairdresser" id="content">
                    <div className="main-content">
                        <div className="short-info">
                            <div className="col-xs-5 col-sm-4">
                                <Gallery pictures={this.props.hairdresser.picture} isOpen={this.state.openGallery} onClose={this.handleCloseGallery} />
                                <UserProfilePicture className="ProfilePicture" role={this.props.hairdresser.picture ? "button" : ""} onClick={this.props.hairdresser.picture ? this.openGallery : ""} picture={this.props.hairdresser.picture} options={options} gender={this.props.hairdresser.gender}/>
                                <div className="pro-label">Pro</div>
                            </div>
                            <div className="col-xs-7 col-sm-8">
                                <h1>{fullName}</h1>
                                <h2>{this.props.hairdresser.numHairfies} Hairfies</h2>
                            </div>
                        </div>
                        <section className="hairdresser-content">
                            <div className="row" style={{minHeight: '350px'}}>
                                <ul className="nav nav-tabs" role="tablist">
                                    <li className={'col-xs-6'+('infos' === this.props.tab ? ' active' : '')}>
                                        <Link route="hairdresser" params={{id: this.props.hairdresser.id}} preserveScrollPosition={true}>
                                            <span className="icon-nav"></span>
                                            Infos
                                        </Link>
                                    </li>
                                    <li className={'col-xs-6'+('hairfies' === this.props.tab ? ' active' : '')}>
                                        <Link route="hairdresser_hairfies" params={{id: this.props.hairdresser.id}} preserveScrollPosition={true}>
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
        if (this.props.hairdresser.picture)
            this.setState({openGallery: true});
    },
    handleCloseGallery: function () {
        this.setState({openGallery: false});
    }
});

module.exports = HairdresserLayout;
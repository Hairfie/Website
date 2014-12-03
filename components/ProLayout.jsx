/** @jsx React.DOM */

var React = require('react');

var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('./UserStatus.jsx');
var Footer = require('./Footer.jsx');

module.exports = React.createClass({
    displayName: 'PublicLayout',
    render: function () {
        var hairdresser = this.props.hairdresser || {};

        return (
            <div className="proLayout">
                <nav className="navbar navbar-default navbar-static-top header" role="navigation">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <NavLink context={this.props.context} className="navbar-brand" href="/"><img id="logo" src="/img/logo@2x.png" alt="Hairfie"/></NavLink>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li><NavLink context={this.props.context} href="/">Home</NavLink></li>
                                <UserStatus context={this.props.context} />
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className={ 'container-fluid ' + this.props.customClass }>
                    <div className="row">
                        <div className="col-sm-3 col-md-2 sidebar">
                            {this.renderBusinessMenu(this.props.business)}
                        </div>
                        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    renderBusinessMenu: function (business) {
        if (!business) return;

        return (
            <ul className="nav nav-sidebar">
                <li>
                    <NavLink context={this.props.context} routeName="pro_business_infos" navParams={{id: business.id, step:'general'}}>
                        Infos <span className="icon icon-right-arrow" aria-hidden="true"></span>
                    </NavLink>
                </li>
                <li>
                    <NavLink context={this.props.context} routeName="pro_business_hairdressers" navParams={{id: business.id}}>
                        Vos Coiffeurs <span className="icon icon-right-arrow" aria-hidden="true"></span>
                    </NavLink>
                </li>
                <li>
                    <NavLink context={this.props.context} routeName="pro_business_timetable" navParams={{id: business.id}}>
                        Horaires <span className="icon icon-right-arrow" aria-hidden="true"></span>
                    </NavLink>
                </li>
                <li><a href="#">Prix <span className="icon icon-right-arrow" aria-hidden="true"></span></a></li>
            </ul>
        );
    }
});

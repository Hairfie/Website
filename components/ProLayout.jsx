/** @jsx React.DOM */

var React = require('react');

var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('./UserStatus.jsx');
var Footer = require('./Footer.jsx');
var FlashMessages = require('./FlashMessages.jsx');

module.exports = React.createClass({
    displayName: 'ProLayout',

    render: function () {
        var hairdresser = this.props.hairdresser || {};
        var main;
        if(this.props.withoutSideBar) {
            main = (
                <div className="row dashboard">
                    <div className="col-sm-12 main">
                        {this.props.children}
                    </div>
                </div>
            );
        } else {
            main = (
                <div className="row dashboard">
                    <div className="col-sm-2 sidebar">
                        {this.renderBusinessMenu(this.props.business)}
                    </div>
                    <div className="col-sm-10 col-sm-offset-2 main">
                        {this.props.children}
                    </div>
                </div>
            );
        }

        return (
            <div className="proLayout">
                <FlashMessages context={this.props.context} />
                <nav className="navbar navbar-default navbar-fixed-top header" role="navigation">
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
                                <UserStatus context={this.props.context} currentBusiness={this.props.business} />
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className={ 'container-fluid ' + this.props.customClass }>
                    { main }
                </div>
            </div>
        );
    },
    renderBusinessMenu: function (business) {
        if (!business) return;

        return (
            <ul className="nav nav-sidebar">
                <li>
                    <NavLink context={this.props.context} routeName="pro_business" navParams={{id: business.id, step:'general'}}>
                        {business.name}
                    </NavLink>
                </li>
                <li>
                    <NavLink context={this.props.context} routeName="pro_business_infos" navParams={{id: business.id}}>
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
                <li>
                    <NavLink context={this.props.context} routeName="pro_business_services" navParams={{id: business.id}}>
                        Services & Prix <span className="icon icon-right-arrow" aria-hidden="true"></span>
                    </NavLink>
                </li>
            </ul>
        );
    }
});

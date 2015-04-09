/** @jsx React.DOM */

var React = require('react');

var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('./UserStatus.jsx');
var Footer = require('./Layout/Footer.jsx');
var FlashMessages = require('./FlashMessages.jsx');
var Loader = require('./Partial/Loader.jsx');

module.exports = React.createClass({
    displayName: 'ProLayout',
    render: function () {
        var bodyClassName = React.addons.classSet('container-fluid dashboard',this.props.customClass);
        var wrapperClassName = React.addons.classSet({
            'withoutSideBar': this.props.withoutSideBar
        });

        return (
            <div className="backoffice proLayout">
                <div id="wrapper"  className={wrapperClassName}>
                    {this.renderHeader()}
                    <div id="page-wrapper">
                        <div className={bodyClassName}>
                            <Loader loading={this.props.loading}>
                                <FlashMessages context={this.props.context} />
                                {this.props.children}
                            </Loader>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    renderHeader: function() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top header" role="navigation">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <NavLink context={this.props.context} className="navbar-brand" routeName="home"><img id="logo" src="/img/logo@2x.png" alt="Hairfie"/></NavLink>
                    </div>
                    <ul className="nav navbar-right top-nav">
                        <li><NavLink context={this.props.context} routeName="home">Home</NavLink></li>
                        <li><NavLink context={this.props.context} routeName="pro_dashboard">Mes salons</NavLink></li>
                        <UserStatus context={this.props.context} currentBusiness={this.props.business} />
                    </ul>
                    {this.renderBusinessMenu(this.props.business)}
                </div>
            </nav>
        );
    },
    renderBusinessMenu: function (business) {
        if (!business) return;

        return (
            <div className="collapse navbar-collapse navbar-ex1-collapse">
                <ul className="nav navbar-nav side-nav">
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business" navParams={{businessId: business.id}}>
                            <i className="fa fa-home"></i> {business.name}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_infos" navParams={{businessId: business.id}}>
                            Infos <span className="icon icon-right-arrow" aria-hidden="true"></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_photos" navParams={{businessId: business.id}}>
                            Photos du salon<span className="icon icon-right-arrow" aria-hidden="true"></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_hairfies" navParams={{businessId: business.id}}>
                            Hairfies <span className="icon icon-right-arrow" aria-hidden="true"></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_members" navParams={{businessId: business.id}}>
                            Votre équipe <span className="icon icon-right-arrow" aria-hidden="true"></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_timetable" navParams={{businessId: business.id}}>
                            Horaires <span className="icon icon-right-arrow" aria-hidden="true"></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_services" navParams={{businessId: business.id}}>
                            Services & Prix <span className="icon icon-right-arrow" aria-hidden="true"></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_customers" navParams={{businessId: business.id}}>
                            Vos clients <span className="icon icon-right-arrow" aria-hidden="true"></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_social_networks" navParams={{businessId: business.id}}>
                            Réseaux sociaux <span className="icon icon-right-arrow" aria-hidden="true"></span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        );
    }
});

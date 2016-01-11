'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var _ = require('lodash');
var User = require('./User.jsx');
var SearchBar = require('./SearchBar.jsx');

var Header = React.createClass({
    render: function() {
        var withProLink = _.isBoolean(this.props.withProLink) ? this.props.withProLink : true;

        return (
            <div>
                {this.renderMobile(withProLink)}
                {this.renderDesktop(withProLink)}
            </div>
        );
    },
    renderMobile: function (withProLink) {
        var proLinkNode;
        if(withProLink) {
            proLinkNode = (<Link route="home_pro">Gérez votre salon</Link>);
        }

        return (
            <div className="mobile-nav visible-xs">
                <header className="container white visible-xs">
                    <Link className="logo col-xs-4" route="home" />
                        <nav className='col-md-8 pull-right'>
                            <ul>
                               <User mobile={true}>
                                    <li>
                                        {proLinkNode}
                                    </li>
                               </User>
                            </ul>
                        </nav>
                    *<a className="col-xs-4 menu-trigger pull-right" role="button"></a>*
                </header>
                <SearchBar mobile={true} />
            </div>
        );
    },
    renderDesktop: function (withProLink) {
        var headerClassName = this.props.home ? 'home' : 'white';
        var proLinkNode;
        if(withProLink) {
            proLinkNode = (<Link className="btn btn-red" route="home_pro">Gérez votre salon</Link>);
        }

        return (
            <div>
                <header className={headerClassName + ' hidden-xs'}>
                    <div className="row">
                        <div className="col-md-12">
                            <Link className="logo col-md-4" route="home" />
                            <nav className='col-md-8 pull-right'>
                                <ul>
                                    <li>
                                        {proLinkNode}
                                    </li>
                                    <User />
                                </ul>
                            </nav>
                        </div>
                    </div>
                </header>
                {this.props.home ? null : <SearchBar />}
            </div>
        );
    }
});

module.exports = Header;
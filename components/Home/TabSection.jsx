'use strict';

var React = require('react');
var Tabs = require('react-bootstrap').Tabs;
var Tab = require('react-bootstrap').Tab;
var SearchBar = require('../Layout/SearchBar.jsx');
var Link = require('../Link.jsx');

var GenderChoice = React.createClass({
    render: function () {
        return (
            <div className="searchbar main-searchbar col-xs-12 hidden-xs">
                <Link route="hairfie_search" params={{address: 'France'}} query={{tags: 'Femme'}} className="btn-gender"><span className="icon-female"/>Vous êtes une femme</Link>             
                <Link route="hairfie_search" params={{address: 'France'}} query={{tags: 'Homme'}} className="btn-gender"><span className="icon-male"/>Vous êtes un homme</Link> 
            </div>
        );
    }
});

var TabSection = React.createClass({
    render: function () {
        var tabTitle1 = <div><span className="icon-hair-dryer"/> Trouvez un salon </div>;
        var tabTitle2 = <div><span className="icon-photo"/>Inspirez-vous de nos photos</div>;

        return (
            <Tabs defaultActiveKey={1} animation={false}>
                <Tab eventKey={1} title={tabTitle1}><SearchBar home={true} {...this.props} /></Tab>
                <Tab eventKey={2} title={tabTitle2}><GenderChoice /></Tab>
          </Tabs>
       );
    },
});

module.exports = TabSection;

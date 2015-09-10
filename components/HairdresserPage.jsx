'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('fluxible-addons-react/connectToStores');
var HairdresserLayout = require('./HairdresserPage/Layout.jsx');
var Link = require('./Link.jsx');
var Picture = require('./Partial/Picture.jsx');

var HairdresserPage = React.createClass({
    render: function () {
        if (!this.props.hairdresser)
            return null;
        var business = this.props.hairdresser.business;
        var address = business.address;
        var disabled = business.isBookable ?
        <Link route="business_booking" className="btn btn-red" params={{ businessId: business.id, businessSlug: business.slug }}>
            Prendre rendez-vous
        </Link> : <a className="btn btn-red" disabled>Prendre rendez-vous</a>;
        return(
            <HairdresserLayout hairdresser={this.props.hairdresser} tab="infos">
                <h3>Lieux où {this.props.hairdresser.firstName} coiffe</h3>
                <div className="col-xs-3 col-lg-2 image-bloc">
                    <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}>
                        <Picture
                            picture={_.first(business.pictures)}
                            options={{ width: 400, height: 400, crop: 'thumb' }}
                            placeholder="/images/placeholder-640.png"
                            style={{width: "100%", "maxWidth": "125px"}}
                        />
                    </Link>
                </div>
                <div className="col-xs-9 col-lg-10">
                    <div>
                        <Link route="business" params={{ businessId: business.id, businessSlug: business.slug }}><h5>{business.name}</h5></Link>
                        <p>{address.street} {address.zipCode} {address.city}</p>
                        <a href={"tel:" + business.phoneNumber}>{business.phoneNumber}</a>
                    </div>
                    <div className="hidden-xs businessButtons">
                        {disabled}
                        <Link route="business" className="btn btn-red" style={{marginLeft: '10px'}} params={{ businessId: business.id, businessSlug: business.slug }}>+ d'infos</Link>
                    </div>
                </div>
                <div className="col-xs-12 visible-xs businessButtons">
                    {disabled}
                    <Link route="business" className="btn btn-red" style={{marginLeft: '10px'}} params={{ businessId: business.id, businessSlug: business.slug }}>+ d'infos</Link>
                </div>
            </HairdresserLayout>
        );
    }
});

HairdresserPage = connectToStores(HairdresserPage, [
    'HairdresserStore'
], function (context, props) {
    return {
        hairdresser: context.getStore('HairdresserStore').getById(props.route.params.id)
    };
});

module.exports = HairdresserPage;
'use strict'

var React = require('react');
var _ = require('lodash');
var Pagination = require('./Pagination.jsx');
var SearchUtils = require('../../lib/search-utils');
var Hairfie = require('../Partial/Hairfie.jsx');
var Newsletter = require('../Partial/Newsletter.jsx');
var HairfieAction = require('../../actions/HairfieActions');

var INFINITE_SCROLL = true;

var HairfieResult = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            page: 1,
            loading: 0,
            isLoading: false
        };
    },
    scrollListener: function (e) {
        var resultDiv = document.getElementsByClassName('salon-hairfies')[0];
        if (!resultDiv) return null;
        var scrollHeight = 0;
        var element = resultDiv;
        while(element){
           scrollHeight += element.offsetTop;
           element = element.offsetParent;
        }
        scrollHeight += resultDiv.offsetHeight;
        if (document.body.scrollTop > (scrollHeight - window.innerHeight)) {
            if (this.state.loading < resultDiv.offsetHeight) {
                this.setState({loading: resultDiv.offsetHeight, isLoading: true});
                this.loadMore();
            } 
        }
    },
    componentDidMount: function () {
        if (INFINITE_SCROLL)
            document.addEventListener('scroll', this.scrollListener);

    },
    componentWillUnmount: function () {
        if (INFINITE_SCROLL)
            document.removeEventListener('scroll', this.scrollListener);
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.result)
            this.setState({isLoading: false});
        if (nextProps.search)
            this.setState({loading: 0});
    },
    render: function () {
        if (!this.props.result) return <div className="loading" />;
        if (this.props.result.numHits == 0) return this.renderNoResult();
        return (
            <div className="tab-pane active">
                <div className="hairfie-search-newsletter">
                    <Newsletter />
                </div>
                <section>
                    <div className="salon-hairfies hairfies">
                        <div className="row">
                            {_.map(this.props.result.hits, function (hairfie) {
                                return <Hairfie className="col-xs-6 col-md-3 single-hairfie" key={hairfie.id} hairfie={hairfie} popup={true} hairfies={_.map(this.props.result.hits, 'id')} />;
                            }.bind(this))}
                        </div>
                    </div>
                    {this.renderLoadMoreButton()}
                    {this.renderLoader()}
                </section>
            </div>
        );
    },
    renderLoadMoreButton: function () {
        if (!INFINITE_SCROLL)
            return (
                <button onClick={this.loadMore} className="btn btn-red">Plus de hairfies</button>
            )
    },
    renderLoader: function () {
        if(!this.state.isLoading) return null;
            return (
            <div className="row">
                <div className="loading" />
            </div>
        );
    },
    loadMore: function () {
        this.setState({page: this.state.page + 1});
        this.context.executeAction(HairfieAction.loadSearchResult, _.assign({}, this.props.search, {page: this.state.page + 1, loadMore: true}));
    },
    renderPagination: function () {
        var numPages = Math.ceil(this.props.result.numHits / 16);
        var params = SearchUtils.searchToRouteParams(this.props.search);

        return <Pagination
            numPages={numPages}
            currentPage={this.props.search.page}
            route="hairfie_search"
            params={params.path}
            query={params.query}
            />
    },
    renderNoResult: function () {
        return (
            <p className="text-center">
                <br />
                <br />
                Aucun résultat correspondant à votre recherche n'a pu être trouvé.
                <br />
                <br />
            </p>
        );
    }
});

module.exports = HairfieResult;

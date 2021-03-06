'use strict'

var React = require('react');
var _ = require('lodash');
var Pagination = require('./Pagination.jsx');
var SearchUtils = require('../../lib/search-utils');
var Hairfie = require('../Partial/Hairfie.jsx');
var Newsletter = require('../Partial/Newsletter.jsx');
var Loading = require('../Partial/Loading.jsx');
var Business = require('./BusinessForHairfies.jsx');
var Select = require('react-select');

var HairfieResult = React.createClass({
    getInitialState: function() {
        return {
            loading: false
        };
    },
    componentWillReceiveProps: function(newProps) {
        this.setState({loading: false});
    },
    render: function () {
        if (!this.props.result) return <Loading />;

        var searchedCategories = this.props.searchedCategories;
        var searchedCategoriesLabels, loadMoreBtn, loader;
        if (searchedCategories) {
            searchedCategoriesLabels = _.map(searchedCategories, function(cat) {
                return (
                    <span key={cat} className="business-label" onClick={this.removeCategory.bind(this, cat)}>{cat}&times;</span>
                );
            }, this)
        }

        if (this.props.result.numHits == 0) return this.renderNoResult(searchedCategoriesLabels);

        loader = (
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        );
        if (this.props.isFullyLoaded) loadMoreBtn = null;
        else
            loadMoreBtn = this.state.loading ? <div className='btn btn-loadmore flex' onClick={this.loadMore}>{loader}</div> : <div className='btn btn-loadmore' onClick={this.loadMore}>En voir<br/>plus</div>;
        return (
            <div className="tab-pane active">

                <section>
                    <div>
                        {searchedCategoriesLabels}
                    </div>
                    <div className="salon-hairfies hairfies">
                        <div className='filter-bar'>
                            <span className='filter-title'>Trier par :</span>
                            <span className='filters'>
                                <Select ref="categories"
                                    name="Tri"
                                    value={this.props.search.sort || 'numLikes'}
                                    onChange={this.handleSelectOrderChange}
                                    placeholder="Spécialité"
                                    allowCreate={false}
                                    options={[{value: 'numLikes', label: 'Les plus likés'},
                                        {value: 'createdAt', label: 'Les plus récents'}]}
                                    multi={false}
                                    searchable={false}
                                    clearable={false}
                                />
                            </span>
                        </div>
                        <div className="row">
                            {_.map(this.props.mixedResult, function (item, i) {
                                if (item && item.accountType) {
                                    return (
                                        <Business business={item} key={item.id + i} />
                                    )
                                } else {
                                    return <Hairfie 
                                        className="col-xs-6 col-sm-4 single-hairfie" 
                                        key={item && item.id ? item.id : Math.random() * i} 
                                        hairfie={item} 
                                        popup={true} 
                                        loadMore={this.loadMore}
                                        hairfies={_.map(this.props.result.hits, 'id')} />;
                                }
                            }.bind(this))}
                        </div>
                    </div>
                    <div className='btn-flex-container'>
                        {loadMoreBtn}
                    </div>
                </section>
            </div>
        );
        return (
            <div className="tab-pane active">

                <section>
                    <div>
                        {searchedCategoriesLabels}
                    </div>
                    <div className="salon-hairfies hairfies">
                        <div className="row">
                            {_.map(this.props.result.hits, function (hairfie) {
                                return <Hairfie 
                                    className="col-xs-6 col-md-4 single-hairfie" 
                                    key={hairfie.id} 
                                    hairfie={hairfie} 
                                    popup={true} 
                                    hairfies={_.map(this.props.result.hits, 'id')} />;
                            }.bind(this))}
                        </div>
                    </div>
                    <div className='btn-flex-container'>
                        {loadMoreBtn}
                    </div>
                </section>
            </div>
        );
    },
    handleSelectOrderChange: function(order) {
        this.props.onChange({sort: order});
    },
    loadMore: function() {
        this.setState({loading: true});
        this.props.loadMore();
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
    renderNoResult: function (searchedCategoriesLabels) {
        return (
            <div className="tab-pane active" id="salons">
                <div className="row">
                    {searchedCategoriesLabels}
                </div>
                <div className="row">
                    <p className="text-center">
                        Aucun résultat correspondant à votre recherche n'a pu être trouvé.
                        <br />
                        Essayez de retirer un filtre ou d'étendre votre recherche géographique pour obtenir plus de résultats !
                    </p>
                </div>
            </div>
        );
    },
    removeCategory: function (category) {
        this.props.onChange({tags: _.without(this.props.search.tags, category)});
    }
});

module.exports = HairfieResult;

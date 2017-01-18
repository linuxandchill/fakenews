import React, { Component } from 'react';
import './App.css';
import Table from './Table.jsx';
import Search from './Search.jsx';
import Button from './Button.jsx';

const DEFAULT_QUERY = '';
const DEFAULT_PAGE = 0; 
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page='; 
const PARAM_HPP = 'hitsPerPage=';

var url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

/* for client-side filtering
function isSearched(searchTerm){
  return function(item){
    //condition that returns true or false
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase()); 
  }
}
*/ 

console.log(url); 

class App extends Component {
  constructor(props){
    super(props); 

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
    }

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this); 
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories= this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this); 
    this.onSearchChange = this.onSearchChange.bind(this); 
    this.onSearchSubmit = this.onSearchSubmit.bind(this); 
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  setSearchTopStories(result){
    const { hits, page } = result;
    const{searchKey, results} = this.state; 

      const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

      const updatedHits = [
      ...oldHits,
      ...hits
      ];

      this.setState({
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page: page}
          }
      });
  }


  fetchSearchTopStories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm]; 
  }

  onSearchSubmit(event){
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm }); 

    if (this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
    }

    event.preventDefault(); 
  }

  onDismiss(id){
    const {searchKey, results} = this.state; 
    const {hits, page} = results[searchKey]; 

    function isNotId(item){
      return item.objectID !== id;
    }

    const updatedHits = hits.filter(isNotId); 

    this.setState({
      results: 
        { ...results, 
          [searchKey]: { hits: updatedHits, page}
        }
    }); 
  }

  onSearchChange(e){
    this.setState({searchTerm: e.target.value})
  }

  render() {
    const { searchTerm, results, searchKey} = this.state; 
    const page = ( results && results[searchKey] && results[searchKey].page ) || 0; 
    const list = (
      results && results[searchKey] && results[searchKey].hits
    ) || []; 

    return (
      <div className="page">
      <div className="interactions">
        <Search 
        value={searchTerm} 
        onChange={this.onSearchChange}
        onSubmit={this.onSearchSubmit}
        > Search

        </Search> 

        {/* everything else is visible when making api fetch */}
            <Table 
            list={list}  
            pattern={searchTerm}
            onDismiss={this.onDismiss}
            /> 

          <Button onClick={()=> { this.fetchSearchTopStories(searchKey, page +1 ) }}>
          More
          </Button>
          
      </div>
      </div>
    );
  }
}


export default App;

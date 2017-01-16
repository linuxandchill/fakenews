import React, { Component } from 'react';
import './App.css';


const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0; 
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page='; 

var url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

/* for client-side filtering
function isSearched(searchTerm){
  return function(item){
    //condition that returns true or false
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase()); 
  }
}
*/ 

class App extends Component {
  constructor(props){
    super(props); 

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories= this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this); 
    this.onSearchChange = this.onSearchChange.bind(this); 
    this.onSearchSubmit = this.onSearchSubmit.bind(this); 
  }

  setSearchTopStories(result){
    this.setState({result}); 
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }

  fetchSearchTopStories(searchTerm, page){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
  }

  onSearchSubmit(event){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm); 
    event.preventDefault(); 
  }

  onDismiss(id){
    function isNotId(item){
      return item.objectID !== id;
    }

    const updatedHits = this.state.result.hits.filter(isNotId); 

    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    }); 
  }

  onSearchChange(e){
    this.setState({searchTerm: e.target.value})
  }

  render() {
    console.log(this.state)
    const { searchTerm, result} = this.state; 
    return (
      <div className="page">
      <div className="interactions">
        <Search 
        value={searchTerm} 
        onChange={this.onSearchChange}
        onSubmit={this.onSearchSubmit}
        > Search

        </Search> 
        </div>

        {/* everything else is visible when making api fetch */}
        { result 
          ?
            <Table 
            list={result.hits}  
            pattern={searchTerm}
            onDismiss={this.onDismiss}
            /> 
          : 
            null
        }
          
      </div>
    );
  }
}

//Search Component
const Search = ({value, onChange, children, onSubmit}) => {
  return(
    <form onSubmit={onSubmit}> 
      <input 
      type="text"
      value={value}
      onChange={onChange}
      /> 
      <button type="submit"> 
        {children} 
      </button>
    </form> 
  )
}

//Table Component
const Table = ({ list, pattern, onDismiss }) =>
    <div className="table">
    { list.map(item =>
    <div key={item.objectID} className="table-row">
    <span style={{ width: '40%' }}>
    <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>
    {item.author}
    </span>
    <span style={{ width: '10%' }}>
    {item.num_comments}
    </span>
    <span style={{ width: '10%' }}>
    {item.points}
    </span>
    <span style={{ width: '10%' }}>
    <Button
    onClick={() => onDismiss(item.objectID)}
    className="button-inline"
    >
    Dismiss
    </Button>
    </span>
    </div>
    )}
</div>

//Button component
const Button = ({onClick, className = '', children}) => {
  return(
    <button 
    onClick={onClick}
    className={className}
    type="button"
    > {children}
    </button> 
  )
}

export default App;

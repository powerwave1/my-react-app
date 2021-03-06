import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


export {
  Button,
  Search,
  Table,
};

const list = [{
  title: 'React',
  url: 'https://facebook.github.io/react/',
  author: 'Jordan Walke',
  num_comments: 8,
  points: 4,
  objectID: 0,
}, {
  title: 'Redux',
  url: 'https://github.com/reactjs/redux',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
}, ];

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
};

const Button = ({onClick, className = '', children}) => 
  <button onClick={onClick} className={className}>{children}</button>

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      list: list,
      searchTerm: DEFAULT_QUERY,
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  componentDidMount() {
    const {searchTerm} = this.state; /* keep state immutable */
    this.fetchSearchTopStories(searchTerm);
  }

  render() {
    const {searchTerm, result} = this.state;

    /* replace with ternary operator before <Table>
    if (!result) {
      return null;
    }
    */

    return (
      <div className="App">
        <header className="App-header">
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search (test children)
          </Search>
          {/** 
          <form>
            <input type="text" value={searchTerm} onChange={this.onSearchChange}/>
          </form>
          */}
          { result ?
          <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss}/>
          : null
          }
          {/**
          { this.state.list.filter(isSearched(this.state.searchTerm)).map(item => 
                <div key={item.objectID}>
                  <span>
                    <a href={item.url}>{item.title}</a>
                  </span>
                  <span>{item.author}</span>
                  <span>{item.num_comments}</span>
                  <span>{item.points}</span>
                  <span>
                    <button onClick={() => this.onDismiss(item.objectID)}>Dismiss</button>
                  </span>
                </div>
            ) }
            */}        
        </header>
      </div>
    );
  }

  onDismiss(id) {
    console.debug(this.state);
    const isNotId = item => item.objectID !== id; /* arrow function as var */
    // const updatedList = this.state.list.filter(isNotId);
    // this.setState({list: updatedList});
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: {...this.state.result, hits: updatedHits}
    });
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  setSearchTopStories(result) {
    this.setState({result});
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault(); // default form submit reloads browser page
  }

  fetchSearchTopStories(searchTerm) {
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`;

    fetch(url)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }
}

class Search extends Component {
  render() {
    const {value, onChange, onSubmit, children} = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange}/>
        <button type="submit">{children}</button>
      </form>
    ); 
  }
}

class Table extends Component {
  render() {
    const {list, pattern, onDismiss} = this.props;
    return (
      <div>
          { /* list.filter(isSearched(pattern)).map(item =>   pattern is not used anymore with server side search */
            list.map(item => 
                <div key={item.objectID}>
                  <span>
                    <a href={item.url}>{item.title}</a>
                  </span>
                  <span>{item.author}</span>
                  <span>{item.num_comments}</span>
                  <span>{item.points}</span>
                  <span>
                    <Button onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
                  </span>
                </div>
            ) }        
      </div>
    );
  }

  
}

export default App;

import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    const term = event.target.value;
    sessionStorage.setItem('term', term);
    this.setState({ term: event.target.value});
  }

  handleEnter(event) {
    if(event.keyCode === 13) {
      this.search();
    }
  }

  componentDidMount() {
    const savedTerm = sessionStorage.getItem('term');
    if(savedTerm) {
      this.setState({ term: savedTerm});
      console.log('Entered if statment')
      
    }
  }

  render() {
    return (

      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange = {this.handleTermChange} onKeyDown = {this.handleEnter} value = {this.state.term}/>
        <a type="submit" onClick = {this.search}>SEARCH</a>
      </div>

    );
  }
}

export default SearchBar;

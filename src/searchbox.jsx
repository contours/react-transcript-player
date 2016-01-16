'use strict'

import React from 'react'

class SearchBox extends React.Component {
  static propTypes =
    { onQuery: React.PropTypes.func.isRequired
    , query: React.PropTypes.string
    };
  static defaultProps = { query: '' };
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleClearClick = this.handleClearClick.bind(this)
  }
  handleChange(event) {
    this.props.onQuery(event.target.value)
  }
  handleClearClick() {
    this.props.onQuery('')
  }
  render() {
    return (
      <div className="col col-8 flex flex-center">
        <label htmlFor="search">Search</label>
        <input
          className="field flex-auto ml1"
          id="search"
          onChange={this.handleChange}
          type="text"
          value={this.props.query}
        />
        <button
          className="btn"
          onClick={this.handleClearClick}
          style={{visibility: this.props.query ? 'visible' : 'hidden'}}
        >
          <i className="fa fa-times-circle fa-lg"></i>
        </button>
      </div>
    )
  }
}
export default SearchBox

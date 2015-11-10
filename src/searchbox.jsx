'use strict'

var React = require('react')

module.exports = React.createClass(
  { getDefaultProps: function() {
      return {query: ''}
    }
  , handleChange: function(event) {
      this.props.onQuery(event.target.value)
    }
  , handleClearClick: function() {
      this.props.onQuery('')
    }
  , render: function() {
      return (
        <div className="col col-8 flex flex-center">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            className="field flex-auto ml1"
            value={this.props.query}
            onChange={this.handleChange} />
          <button
            className="btn"
            style={{visibility: this.props.query ? 'visible' : 'hidden'}}
            onClick={this.handleClearClick}>
            <i className="fa fa-times-circle fa-lg"></i>
          </button>
        </div>
      )
    }
  }
)

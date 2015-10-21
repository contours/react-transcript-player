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
        <div>
          <input
            type="text"
            value={this.props.query}
            onChange={this.handleChange} />
          <button
            style={{display: this.props.query ? 'inline' : 'none'}}
            onClick={this.handleClearClick}>x</button>
        </div>
      )
    }
  }
)

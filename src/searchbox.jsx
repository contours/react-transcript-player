'use strict'

var React = require('react')

module.exports = React.createClass(
  { handleChange: function(event) {
      this.props.onQuery(event.target.value)
    }
  , render: function() {
      return <input type="text" onChange={this.handleChange} />
    }
  }
)

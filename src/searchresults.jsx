'use strict'

var React = require('react')

module.exports = React.createClass(
  { render: function() {
      return (
        <div>
          <span>{this.props.count} matches </span>
          <button>&lt;</button><button>&gt;</button>
        </div>
      )
    }
  }
)

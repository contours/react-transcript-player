'use strict'

var React = require('react')

module.exports = React.createClass(
  { handleBackwardClick: function() {
      this.props.onNavigateResult('backward')
    }
  , handleForwardClick: function() {
      this.props.onNavigateResult('forward')
    }
  , render: function() {
      return (
        <div style={{display: 'inline', marginLeft: '1em'}}>
          <span>{this.props.count} matches </span>
          <button onClick={this.handleBackwardClick}>&lt;</button>
          <button onClick={this.handleForwardClick}>&gt;</button>
        </div>
      )
    }
  }
)

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
        <div className="col col-4 flex flex-center">
          {this.props.count}&nbsp;matches
          <div className="inline-block border rounded ml1">
            <button
              className="left btn border-right"
              onClick={this.handleBackwardClick}>
              <i className="fa fa-chevron-left"></i>
            </button>
            <button
              className="right btn"
              onClick={this.handleForwardClick}>
              <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )
    }
  }
)

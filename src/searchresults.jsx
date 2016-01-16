'use strict'

import React from 'react'

class SearchResults extends React.Component {
  static propTypes =
    { count: React.PropTypes.number.isRequired
    , onNavigateResult: React.PropTypes.func.isRequired
    };
  constructor(props) {
    super(props)
    this.handleBackwardClick = this.handleBackwardClick.bind(this)
    this.handleForwardClick = this.handleForwardClick.bind(this)
  }
  handleBackwardClick() {
    this.props.onNavigateResult('backward')
  }
  handleForwardClick() {
    this.props.onNavigateResult('forward')
  }
  render() {
    return (
      <div className="col col-4 flex flex-center">
        {this.props.count}&nbsp;matches
        <div className="inline-block border rounded ml1">
          <button
            className="left btn border-right"
            onClick={this.handleBackwardClick}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button
            className="right btn"
            onClick={this.handleForwardClick}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    )
  }
}
export default SearchResults

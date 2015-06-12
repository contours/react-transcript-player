'use strict'

var React = require('react')

module.exports = React.createClass(
  { componentDidMount() {
      React.findDOMNode(this.refs.audio)
        .addEventListener('timeupdate', this.handleTimeUpdate)
    }
  , componentDidUpdate(prevProps) {
      if (this.props.seekTime !== prevProps.seekTime) {
        this.seek()
      }
    }
  , componentWillUnmount() {
      React.findDOMNode(this.refs.audio)
        .removeEventListener('timeupdate', this.handleTimeUpdate)
    }
  , handleTimeUpdate: function() {
      this.props.onTimeUpdate(
        parseInt(React.findDOMNode(this.refs.audio).currentTime * 1000))
    }
  , seek: function() {
      if (this.props.seekTime !== null) {
        React.findDOMNode(this.refs.audio)
          .currentTime = this.props.seekTime / 1000
      }
    }
  , render: function() {
      return (
        <div>
          <audio ref="audio" src={this.props.media} controls></audio>
        </div>
      )
    }
  }
)


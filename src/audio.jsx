'use strict'

var React = require('react')

module.exports = React.createClass(
  { componentDidUpdate(prevProps) {
      if (this.props.seekTime !== prevProps.seekTime) {
        this.seek()
      }
    }
  , handleTimeUpdate: function() {
      this.props.onTimeUpdate(
        parseInt(this.refs.audio.currentTime * 1000))
    }
  , handlePlaying: function() {
      this.props.onEnded(false)
    }
  , handleEnded: function() {
      this.props.onEnded(true)
    }
  , seek: function() {
      if (this.props.seekTime !== null) {
        this.refs.audio.currentTime = this.props.seekTime / 1000
      }
    }
  , render: function() {
      return (
        <div>
          <audio ref="audio" controls
                 style={{width: '100%'}}
                 src={this.props.media}
                 onTimeUpdate={this.handleTimeUpdate}
                 onPlaying={this.handlePlaying}
                 onEnded={this.handleEnded}
          ></audio>
        </div>
      )
    }
  }
)


'use strict'

var React = require('react')
  , AudioPlayer = require('./audio')
  , TranscriptView = require('./transcript')

module.exports = React.createClass(
  { getInitialState: function() {
      return {time: 0, seekTime: null, ended: false}
    }
  , handleTimeUpdate: function(time) {
      if (this.state.seekTime !== null &&
          Math.abs(time - this.state.seekTime) < 10) {
        this.setState({time: time, seekTime: null})
      } else {
        this.setState({time: time})
      }
    }
  , handleEnded: function(ended) {
      this.setState({ended: ended})
    }
  , handleSeekRequest: function(seekTime) {
      this.setState({seekTime: seekTime, ended: false})
    }
  , render: function() {
      var style =
        { border: '1px solid black'
        , width: 600
        }
      return (
      <div style={style}>
        <style scoped>{`
.turn { padding: 0.25em; color: rgba(28,28,28,1);
        transition: color 1s ease }
.turn:nth-child(odd) { background-color: #f1f1f1 }
.speaker { margin-right: 0.5em; font-weight: bold }
.speech { cursor: pointer; color: rgba(28,28,28,1);
          transition: color 1s ease }
.speech:hover { background-color: #d0effe;
                outline: 0.2em solid #d0effe }
.played { color: rgba(28,28,28,0.4) }
`}</style>
        <AudioPlayer
          media={this.props.transcript.media}
          seekTime={this.state.seekTime}
          onTimeUpdate={this.handleTimeUpdate}
          onEnded={this.handleEnded} />
        <TranscriptView
          transcript={this.props.transcript}
          time={this.state.time} ended={this.state.ended}
          onSeekRequest={this.handleSeekRequest} />
      </div>
      )
    }
  }
)


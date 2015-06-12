'use strict'

var React = require('react')
  , AudioPlayer = require('./audio')
  , TranscriptView = require('./transcript')

module.exports = React.createClass(
  { getInitialState: function() {
      return {time: 0, seekTime: null}
    }
  , handleTimeUpdate: function(time) {
      if (this.state.seekTime !== null &&
          Math.abs(time - this.state.seekTime) < 10) {
        this.setState({time: time, seekTime: null})
      } else {
        this.setState({time: time})
      }
    }
  , handleSeekRequest: function(seekTime) {
      this.setState({seekTime: seekTime})
    }
  , render: function() {
      var style =
        { display: "flex"
        , flexFlow: "column nowrap"
        , width: 400
        }
      return (
      <div style={style}>
        <style scoped>{`
.turn { padding: 0.25em }
.turn:nth-child(odd) { background-color: #f1f1f1 }
.speaker { margin-right: 0.5em; font-weight: bold }
.word { cursor: pointer }
.word:hover { background-color: #d0effe;
              outline: 0.2em solid #d0effe }
`}</style>
        <AudioPlayer
          media={this.props.transcript.media}
          seekTime={this.state.seekTime}
          onTimeUpdate={this.handleTimeUpdate} />
        <TranscriptView
          transcript={this.props.transcript}
          time={this.state.time}
          onSeekRequest={this.handleSeekRequest} />
      </div>
      )
    }
  }
)


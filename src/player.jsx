'use strict'

var React = require('react')
  , AudioPlayer = require('./audio')
  , SearchBox = require('./searchbox')
  , SearchResults = require('./searchresults')
  , TranscriptView = require('./transcript')
  , search = require('./search')

module.exports = React.createClass(
  { getDefaultProps: function() {
      return { maxHeight: Number.MAX_VALUE }
    }
  , getInitialState: function() {
      return (
        { time: 0
        , seekTime: null
        , ended: false
        , searchResults: search.execute(this.props.transcript.turns)
        })
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
  , handleQuery: function(query) {
      const re = query === '' ? null : new RegExp(query, 'ig')
          , results = search.execute(this.props.transcript.turns, re)
      this.setState({searchResults: results})
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
.speech strong { color: red; font-weight: normal }
.played { color: rgba(28,28,28,0.4) }
`}</style>
        <AudioPlayer
          media={this.props.transcript.media}
          seekTime={this.state.seekTime}
          onTimeUpdate={this.handleTimeUpdate}
          onEnded={this.handleEnded} />
        <SearchBox
          onQuery={this.handleQuery} />
        <SearchResults count={this.state.searchResults.get('count')} />
        <TranscriptView
          speakers={this.props.transcript.speakers}
          turns={this.props.transcript.turns}
          highlights={this.state.searchResults.get('matches')}
          maxHeight={this.props.maxHeight}
          time={this.state.time} ended={this.state.ended}
          onSeekRequest={this.handleSeekRequest} />
      </div>
      )
    }
  }
)


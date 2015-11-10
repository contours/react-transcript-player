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
        , query: ''
        , searchResults: search.execute(this.props.transcript.turns)
        , resultIndex: null
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
      this.setState({query: query, searchResults: results, resultIndex: null})
    }
  , handleNavigateResult: function(direction) {
      if (this.state.searchResults.get('count') === 0) return
      const times = this.state.searchResults.get('times')
      let index = this.state.resultIndex
      if (direction === 'forward') {
        index = (index === null) ? 0 : index + 1
        if (index === times.size) index = 0
      } else {
        index = (index === null) ? times.size - 1 : index - 1
        if (index < 0) index = times.size - 1
      }
      this.setState({resultIndex: index})
      this.handleSeekRequest(times.get(index))
    }
  , render: function() {
      var searchResults = <SearchResults
            count={this.state.searchResults.get('count')}
            onNavigateResult={this.handleNavigateResult} />
      return (
      <div className="container flex flex-column border">
        <AudioPlayer
          media={this.props.transcript.media}
          seekTime={this.state.seekTime}
          onTimeUpdate={this.handleTimeUpdate}
          onEnded={this.handleEnded} />
        <div className="clearfix p1 mb1">
          <SearchBox
            query={this.state.query}
            onQuery={this.handleQuery} />
          {this.state.query ? searchResults : ''}
        </div>
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


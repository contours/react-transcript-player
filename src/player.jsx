'use strict'

import React from 'react'
import AudioPlayer from './audio'
import SearchBox from './searchbox'
import SearchResults from './searchresults'
import TranscriptView from './transcript'
import * as search from './search'

class TranscriptPlayer extends React.Component {
  static propTypes =
    { onTimeUpdate: React.PropTypes.func
    , seekTime: React.PropTypes.number
    , transcript: React.PropTypes.shape(
        { id: React.PropTypes.string
        , media: React.PropTypes.string
        , speakers: React.PropTypes.arrayOf(React.PropTypes.string)
        , turns: React.PropTypes.arrayOf(React.PropTypes.object)
        }).isRequired
    };
  static defaultProps = {seekTime: null};
  constructor(props) {
    super(props)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    this.handleEnded = this.handleEnded.bind(this)
    this.handleSeekRequest = this.handleSeekRequest.bind(this)
    this.handleQuery = this.handleQuery.bind(this)
    this.handleNavigateResult = this.handleNavigateResult.bind(this)
    this.state =
      { time: 0
      , seekTime: props.seekTime
      , ended: false
      , query: ''
      , searchResults: search.execute(props.transcript.turns)
      , resultIndex: null
      }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({seekTime: nextProps.seekTime})
  }
  handleTimeUpdate(unrounded_time) {
    const time = Math.round(unrounded_time)
    if (this.props.onTimeUpdate && time !== this.state.time) {
      this.props.onTimeUpdate(time)
    }
    if (time === this.state.seekTime) {
      this.setState({time: time, seekTime: null})
    } else {
      this.setState({time: time})
    }
  }
  handleEnded(ended) {
    this.setState({ended: ended})
  }
  handleSeekRequest(seekTime) {
    this.setState({seekTime: seekTime, ended: false})
  }
  handleQuery(query) {
    const re = query === '' ? null : new RegExp(query, 'ig')
        , results = search.execute(this.props.transcript.turns, re)
    this.setState({query: query, searchResults: results, resultIndex: null})
  }
  handleNavigateResult(direction) {
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
  render() {
    var searchResults = (
      <SearchResults
        count={this.state.searchResults.get('count')}
        onNavigateResult={this.handleNavigateResult}
      />
    )
    return (
      <div className="flex flex-column">
        <AudioPlayer
          media={this.props.transcript.media}
          onEnded={this.handleEnded}
          onTimeUpdate={this.handleTimeUpdate}
          seekTime={this.state.seekTime}
        />
        <div className="clearfix p1 mb1">
          <SearchBox
            onQuery={this.handleQuery}
            query={this.state.query}
          />
          {this.state.query ? searchResults : ''}
        </div>
        <TranscriptView
          ended={this.state.ended}
          highlights={this.state.searchResults.get('matches')}
          key={this.props.transcript.id}
          onSeekRequest={this.handleSeekRequest}
          speakers={this.props.transcript.speakers}
          time={this.state.time}
          turns={this.props.transcript.turns}
        />
      </div>
    )
  }
}
export default TranscriptPlayer

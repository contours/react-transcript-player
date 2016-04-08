'use strict'

import React from 'react'
import {Map} from 'immutable'
import AudioPlayer from './audio'
import SearchBox from './searchbox'
import SearchResults from './searchresults'
import TranscriptView from './transcript'
import * as search from './search'

const MIN_QUERY_LEN = 3

class TranscriptPlayer extends React.Component {
  static propTypes =
    { onPause: React.PropTypes.func
    , onPlaying: React.PropTypes.func
    , onTimeUpdate: React.PropTypes.func
    , play: React.PropTypes.bool
    , seekTime: React.PropTypes.number
    , transcript: React.PropTypes.shape(
        { id: React.PropTypes.string
        , media: React.PropTypes.string
        , speakers: React.PropTypes.arrayOf(React.PropTypes.string)
        , turns: React.PropTypes.arrayOf(React.PropTypes.object)
        }).isRequired
    };
  static defaultProps = {play: false, seekTime: null};
  constructor(props) {
    super(props)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    this.handleEnded = this.handleEnded.bind(this)
    this.handlePause = this.handlePause.bind(this)
    this.handlePlaying = this.handlePlaying.bind(this)
    this.handleSeekRequest = this.handleSeekRequest.bind(this)
    this.handleQuery = this.handleQuery.bind(this)
    this.findNextResultTime = this.findNextResultTime.bind(this)
    this.findPrevResultTime = this.findPrevResultTime.bind(this)
    this.handleNavigateResult = this.handleNavigateResult.bind(this)
    this.state =
      { time: 0
      , seekTime: props.seekTime
      , playing: false
      , query: ''
      , searchResults: null
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
  handleEnded() {
    this.setState({playing: false})
    if (this.props.onPause) this.props.onPause()
  }
  handlePause() {
    if (this.props.onPause) this.props.onPause()
  }
  handlePlaying() {
    this.setState({playing: true})
    if (this.props.onPlaying) this.props.onPlaying()
  }
  handleSeekRequest(seekTime) {
    this.setState({seekTime: seekTime})
  }
  handleQuery(query) {
    if (query.length < MIN_QUERY_LEN) {
      this.setState({query, searchResults: null})
    } else {
      const searchResults = search.execute(
        this.props.transcript.turns, new RegExp(query, 'ig'))
      const times = searchResults.get('times')
      if (times.size > 0) {
        this.setState(
          {query, searchResults, seekTime: times.first(), play: false})
      } else {
        this.setState({query, searchResults})
      }
    }
  }
  findNextResultTime(searchResults) {
    const times = searchResults.get('times')
    let seekTime = times.first()
    for (let time of times.values()) {
      if (time > this.state.time) {
        seekTime = time
        break
      }
    }
    return seekTime
  }
  findPrevResultTime(searchResults) {
    const times = searchResults.get('times')
    let seekTime = times.last()
    for (let time of times.reverse().values()) {
      if (time < this.state.time) {
        seekTime = time
        break
      }
    }
    return seekTime
  }
  handleNavigateResult(direction) {
    if (this.state.searchResults === null) return
    if (this.state.searchResults.get('times').size == 0) return
    this.handleSeekRequest(direction === 'forward'
      ? this.findNextResultTime(this.state.searchResults)
      : this.findPrevResultTime(this.state.searchResults))
  }
  render() {
    var searchResults = this.state.searchResults === null ? null : (
      <SearchResults
        count={this.state.searchResults.get('times').size}
        onNavigateResult={this.handleNavigateResult}
      />
    )
    return (
      <div className="flex flex-column">
        <AudioPlayer
          media={this.props.transcript.media}
          onEnded={this.handleEnded}
          onPause={this.handlePause}
          onPlaying={this.handlePlaying}
          onTimeUpdate={this.handleTimeUpdate}
          play={this.state.playing}
          seekTime={this.state.seekTime}
        />
        <div className="clearfix p1 mb1">
          <SearchBox
            onQuery={this.handleQuery}
            query={this.state.query}
          />
          {searchResults}
        </div>
        <TranscriptView
          highlights={this.state.searchResults
            ? this.state.searchResults.get('matches') : Map()}
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

'use strict'

import React from 'react'
import {Map, List} from 'immutable'
import TurnView from './transcript-turn'
import functify from './functify'
import {progress, debounce} from './utils'

class TranscriptView extends React.Component {
  static propTypes =
    { highlights: React.PropTypes.instanceOf(Map)
    , onSeekRequest: React.PropTypes.func.isRequired
    , speakers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    , time: React.PropTypes.number.isRequired
    , turns: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    };
  static defaultProps =
    { highlights: Map()
    };
  constructor(props) {
    super(props)
    this.handleTurnMounted = this.handleTurnMounted.bind(this)
    this.handleResize = debounce(this.handleResize, 100).bind(this)
    this.state =
      { startTime: 0
      , endTime: Number.MAX_VALUE
      , nextTurnIndex: 0
      , windowDimensions: `${window.innerHeight}x${window.innerWidth}` }
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.time > this.state.endTime ||
        nextProps.time < this.state.startTime) {

      this.setState(
        { startTime: nextProps.time
        , endTime: Number.MAX_VALUE
        , nextTurnIndex: this.findNextTurnIndex(nextProps.turns, nextProps.time)
        })
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  findNextTurnIndex(turns, time) {
    for (let i = 0; i < turns.length; i++) {
      if (turns[i].end > time) return i
    }
    return 0
  }
  handleResize() {
    this.setState(
      { windowDimensions: `${window.innerHeight}x${window.innerWidth}`
      , endTime: Number.MAX_VALUE
      , nextTurnIndex: this.findNextTurnIndex(this.props.turns, this.props.time)
      })
  }
  handleTurnMounted(status, index, end) {
    var nextState = {}
    switch (status) {
      case 'ok':
        nextState.nextTurnIndex = index + 1
        break
      case 'truncated':
        nextState.endTime = end
        break
      case 'failed':
        nextState.endTime = this.props.turns[index - 1].end
        nextState.nextTurnIndex = index - 1
        break
      default:
        throw `unexpected status ${status}`
    }
    if (this.props.time > nextState.endTime) {
      nextState =
        { startTime: this.props.time
        , endTime: Number.MAX_VALUE
        , nextTurnIndex: this.findNextTurnIndex(
            this.props.turns, this.props.time)
        }
    }
    this.setState(nextState)
  }
  createTurnView(index, turn) {
    const speech = functify(turn.speech)
      .enumerate()
      .map(([i, s]) => { s.index = i; return s })
      .skipWhile(s => s.end < this.state.startTime)
      .takeUntil(s => s.start > this.state.endTime)
      .toArray()
    return (
      <TurnView
        highlights={this.props.highlights.get(index, List())}
        index={index}
        key={`turn-${index}.${this.state.startTime}`}
        onMounted={this.handleTurnMounted}
        onSpeechClick={this.props.onSeekRequest}
        progress={progress(this.props.time, turn.start, turn.end)}
        sentences={turn.sentences}
        speaker={this.props.speakers[turn.speaker]}
        speech={speech}
        time={this.props.time}
      />
    )
  }
  render() {
    const turnViews = functify(this.props.turns)
      .enumerate()
      .skipWhile(([, turn]) => turn.end < this.state.startTime)
      .takeUntil(([index, ]) => index > this.state.nextTurnIndex)
      .map(([index, turn]) => this.createTurnView(index, turn))
      .toArray()
    return (
      <div
        className="flex-auto"
        key={this.state.windowDimensions}
      >{turnViews}</div>
    )
  }
}
export default TranscriptView

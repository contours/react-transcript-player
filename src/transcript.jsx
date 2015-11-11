'use strict'

import React from 'react'
import Immutable from 'immutable'
import TurnView from './transcript-turn'
import {enumerate} from './itertools'
import {progress, debounce} from './utils'

class TranscriptView extends React.Component {
  static propTypes =
    { ended: React.PropTypes.bool
    , highlights: React.PropTypes.instanceOf(Immutable.List)
    , onSeekRequest: React.PropTypes.func.isRequired
    , speakers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    , time: React.PropTypes.number.isRequired
    , turns: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    }
  static defaultProps =
    { ended: false
    , highlights: Immutable.List.of()
    }
  constructor(props) {
    super(props)
    this.handleResize = debounce(this.handleResize, 1000).bind(this)
    this.state =
      { startTime: 0
      , endTime: Number.MAX_VALUE
      , nextTurnIndex: 0
      , windowHeight: window.innerHeight }
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.time > this.state.endTime ||
        nextProps.time < this.state.startTime) {

      let nextTurnIndex = 0
      for (; nextTurnIndex < nextProps.turns.length - 1; nextTurnIndex++) {
        if (nextProps.turns[nextTurnIndex].end > nextProps.time) {
          break
        }
      }
      this.setState(
        { startTime: nextProps.time
        , endTime: Number.MAX_VALUE
        , nextTurnIndex: nextTurnIndex
        })
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  handleResize() {
    this.setState({windowHeight: window.innerHeight})
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
    this.setState(nextState)
  }
  createTurnView(index, turn) {
    const speech = enumerate(turn.speech)
      .map(([i, s]) => { s.index = i; return s })
      .skipWhile(s => s.end < this.state.startTime)
      .takeUntil(s => s.start > this.state.endTime)
      .toArray()
    return (
      <TurnView
        highlights={this.props.highlights.get(index)}
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
    const turnViews = enumerate(this.props.turns)
      .skipWhile(([, turn]) => turn.end < this.state.startTime)
      .takeUntil(([index, ]) => index > this.state.nextTurnIndex)
      .map(([index, turn]) => this.createTurnView(index, turn))
      .toArray()
    return (
      <div
        className="flex-auto"
        key={this.state.windowHeight}
      >{turnViews}</div>
    )
  }
}
export default TranscriptView

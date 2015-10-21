'use strict'

var React = require('react')
  , TurnView = require('./transcript-turn')
  , {enumerate} = require('./itertools')

module.exports = React.createClass(
  { handleTurnMounted: function(status, index, height, end) {
      var nextState = {}
      switch (status) {
        case 'ok':
          nextState.nextTurnIndex = index + 1
          nextState.availableHeight = this.state.availableHeight - height
          break
        case 'truncated':
          nextState.endTime = end
          nextState.availableHeight = 0
          break
        case 'failed':
          nextState.endTime = this.props.turns[index - 1].end
          nextState.nextTurnIndex = index - 1
          nextState.availableHeight = 0
          break
        default:
          throw `unexpected status ${status}`
      }
      this.setState(nextState)
  }
  , getDefaultProps: function() {
      return { maxHeight: Number.MAX_VALUE }
  }
  , getInitialState: function() {
      return { startTime: 0
             , endTime: Number.MAX_VALUE
             , nextTurnIndex: 0
             , availableHeight: this.props.maxHeight }
    }
  , componentWillReceiveProps: function(nextProps) {
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
          , availableHeight: this.props.maxHeight
          })
      }
    }
  , createTurnView: function(index, turn) {
      const speech = enumerate(turn.speech)
              .map(([i, s]) => { s.index = i; return s })
              .skipWhile(s => s.end < this.state.startTime)
              .takeUntil(s => s.start > this.state.endTime)
              .toArray()
      return <TurnView
        key={`turn-${index}.${this.state.startTime}`}
        index={index}
        maxHeight={this.state.availableHeight}
        speaker={this.props.speakers[turn.speaker]}
        speech={speech}
        sentences={turn.sentences}
        highlights={this.props.highlights.get(index)}
        time={this.props.time}
        played={this.props.ended || this.props.time > (turn.end + 5)}
        playing={!this.props.ended && (this.props.time >= turn.start
                                    && this.props.time <= turn.end)}
        onMounted={this.handleTurnMounted}
        onSpeechClick={this.props.onSeekRequest} />
    }
  , render: function() {
      const turnViews = enumerate(this.props.turns)
        .skipWhile(([, turn]) => turn.end < this.state.startTime)
        .takeUntil(([index, ]) => index > this.state.nextTurnIndex)
        .map(([index, turn]) => this.createTurnView(index, turn))
        .toArray()
      return <div>{turnViews}</div>
    }
  }
)


'use strict'

var React = require('react/addons')
  , SpeechView
  , TurnView

function past(a, b) {
  return a >= (b - 1)
}

SpeechView = React.createClass(
  { mixins: [React.addons.PureRenderMixin]
  , handleClick: function() {
      this.props.onClick(this.props.start)
    }
  , render: function() {
      return (
        <span className={this.props.played ? 'speech played' : 'speech'}
          onClick={this.handleClick}
        >{this.props.text}</span>
      )
    }
  }
)

TurnView = React.createClass(
  { mixins: [React.addons.PureRenderMixin]
  , render: function() {
      var played = this.props.ended || past(this.props.time, this.props.end)
        , speech = this.props.speech.map(
        s => [ <SpeechView
                 start={s.start}
                 text={s.text}
                 played={this.props.ended || past(this.props.time, s.end)}
                 onClick={this.props.onSpeechClick} />
             , ' ' ])
      return (
        <div className={played ? 'turn played' : 'turn'}>
          <span className="speaker">{this.props.speaker}</span>
          {speech}
        </div>
      )
    }
  }
)

module.exports = React.createClass(
  { mixins: [React.addons.PureRenderMixin]
  , render: function() {
      var turns = this.props.transcript.turns.map(
        (t, i) => <TurnView key={`turn-${i}`}
          speaker={this.props.transcript.speakers[t.speaker]}
          speech={t.speech} start={t.start} end={t.end}
          time={this.props.time} ended={this.props.ended}
          onSpeechClick={this.props.onSeekRequest} />
      )
      return <div>{turns}</div>
    }
  }
)


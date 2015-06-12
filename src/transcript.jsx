'use strict'

var React = require('react')
  , WordView
  , SpeakerLabel
  , TurnView

function fadeIf(test) {
  var alpha = test ? '0.3' : '1'
  return { color: `rgba(0, 0, 0, ${alpha})`
         , transition: 'color 0.5s ease' }
}

function past(a, b) {
  return a >= (b - 1)
}

WordView = React.createClass(
  { handleClick: function() {
      this.props.onClick(this.props.word.start)
    }
  , render: function() {
      return (
        <span className="word"
          style={fadeIf(past(this.props.time, this.props.word.end))}
          onClick={this.handleClick}
        >{this.props.word.text}</span>
      )
    }
  }
)

SpeakerLabel = React.createClass(
  { render: function() {
      return (
        <span className="speaker"
          style={fadeIf(this.props.fade)}
        >{this.props.speaker}</span>
      )
    }
  }
)

TurnView = React.createClass(
  { render: function() {
      var words = this.props.words.map(
        w => [ <WordView word={w}
                 time={this.props.time}
                 onClick={this.props.onWordClick}
               />
             , ' ' ]
      )
      return (
        <div className="turn">
          <SpeakerLabel
            speaker={this.props.speaker}
            fade={past(this.props.time, this.props.words.slice(-1)[0].end)}
          />{words}
        </div>
      )
    }
  }
)

module.exports = React.createClass(
  { render: function() {
      var turns = this.props.transcript.turns.map(
        (t, i) => <TurnView key={`turn-${i}`}
          speaker={this.props.transcript.speakers[t.speaker]}
          words={t.words}
          time={this.props.time}
          onWordClick={this.props.onSeekRequest} />
      )
      return <div>{turns}</div>
    }
  }
)


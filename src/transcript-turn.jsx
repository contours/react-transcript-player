'use strict'

const React = require('react/addons')
  , {enumerate} = require('./itertools')
  , highlight = require('./highlight')

function past(a, b) {
  return a >= (b - 1)
}

const SpeechView = React.createClass(
  { mixins: [React.addons.PureRenderMixin]
  , handleClick: function() {
      this.props.onClick(this.props.start)
    }
  , highlight: function() {
      return highlight(this.props.text, this.props.highlights)
        .map(([highlighted, text], index) =>
             highlighted ? <strong key={index}>{text}</strong>
                         : <span key={index}>{text}</span>)
    }
  , render: function() {
      return (
        <span className={this.props.played ? 'speech played' : 'speech'}
          onClick={this.handleClick}
        >{this.highlight()}</span>
      )
    }
  }
)

module.exports = React.createClass(
  { componentDidMount() {
      const root = React.findDOMNode(this)
      var status, end
      if (root.offsetHeight <= this.props.maxHeight) {
        status = 'ok'
        end = this.props.speech.slice(-1)[0].end
      } else {
        let i = this.props.speech.length - 1
        for (; i >= 0; i--) {
          React.findDOMNode(this.refs['speech-' + i]).style.display = 'none'
          if (root.offsetHeight <= this.props.maxHeight) {
            break
          }
        }
        if (i > 0) {
          status = 'truncated'
          end = this.props.speech[i - 1].end
        } else {
          status = 'failed'
        }
      }
      this.props.onMounted(status, this.props.index, root.offsetHeight, end)
    }
  , shouldComponentUpdate: function(nextProps) {
      if (!nextProps.highlights.equals(this.props.highlights)) return true
      if (nextProps.played !== this.props.played) return true
      if (nextProps.time < nextProps.speech[0].start) return false
      if (nextProps.time > nextProps.speech.slice(-1)[0].end) return false
      return true
    }
  , render: function() {
      const speechViews = enumerate(this.props.speech)
        .map(([index, speech]) => {
          return (
            [ <SpeechView
                ref={'speech-' + index}
                start={speech.start}
                text={speech.text}
                highlights={this.props.highlights.get(index)}
                played={this.props.played || past(this.props.time, speech.end)}
                onClick={this.props.onSpeechClick} />
            , ' '
            ])})
         .toArray()
      return (
        <div className={this.props.played ? 'turn played' : 'turn'}>
          <span className="speaker">{this.props.speaker}</span>
          {speechViews}
        </div>
      )
    }
  }
)


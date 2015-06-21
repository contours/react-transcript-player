'use strict'

const React = require('react/addons')
  , {functify} = require('functify')
  , {enumerate} = require('./itertools')

function past(a, b) {
  return a >= (b - 1)
}

const SpeechView = React.createClass(
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

module.exports = React.createClass(
  { mixins: [React.addons.PureRenderMixin]
  , componentDidMount() {
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
      if (nextProps.time < nextProps.speech[0].start) return false
      if (nextProps.time > nextProps.speech.slice(-1)[0].end) return false
      return true
    }
  , render: function() {
      console.log(this.props)
      const speechViews = enumerate(functify(this.props.speech))
        .map(([index, speech]) => {
          return (
            [ <SpeechView
                ref={'speech-' + index}
                start={speech.start}
                text={speech.text}
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


'use strict'

const React = require('react')
  , ReactDOM = require('react-dom')
  , PureRenderMixin = require('react-addons-pure-render-mixin')
  , functify = require('functify')
  , highlight = require('./highlight')
  , {progress} = require('./utils')

const SpeechView = React.createClass(
  { mixins: [PureRenderMixin]
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
      let className = 'speech ' + this.props.progress
      if (this.props.highlights.size > 0) className += ' highlighted'
      return (
        <span className={className} onClick={this.handleClick}
        >{this.highlight()}</span>
      )
    }
  }
)

module.exports = React.createClass(
  { componentDidMount() {
      const root = ReactDOM.findDOMNode(this)
      var status, end
      if (root.offsetHeight <= this.props.maxHeight) {
        status = 'ok'
        end = this.props.speech.slice(-1)[0].end
      } else {
        let nodes = this.refs.speech.getElementsByClassName('speech')
        let i = nodes.length - 1
        for (; i >= 0; i--) {
          nodes.item(i).style.display = 'none'
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

  , render: function() {
      const speechViews = functify(this.props.speech)
        .map(speech => {
          return (
            [ <SpeechView
                start={speech.start}
                text={speech.text}
                highlights={this.props.highlights.get(speech.index)}
                progress={progress(this.props.time, speech.start, speech.end)}
                onClick={this.props.onSpeechClick} />
            , ' '
            ])})
         .toArray()
      let className = 'turn ' + this.props.progress + ' p1'
      className += this.props.index % 2 ? ' bg-white' : ' bg-silver'
      return (
        <div className={className} style={{transition: 'color 0.4s ease'}}>
          <span className="bold mr1">{this.props.speaker}</span>
          <div className="inline" ref="speech">{speechViews}</div>
        </div>
      )
    }
  }
)


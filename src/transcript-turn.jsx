'use strict'

const React = require('react')
  , ReactDOM = require('react-dom')
  , PureRenderMixin = require('react-addons-pure-render-mixin')
  , functify = require('functify')
  , highlight = require('./highlight')

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
      let className = 'speech'
      if (this.props.played) className += ' played'
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
        let nodes = ReactDOM.findDOMNode(this.refs.speech)
                            .getElementsByClassName('speech')
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
/*
  , shouldComponentUpdate: function(nextProps) {
      if (!nextProps.highlights.equals(this.props.highlights)) return true
      if (nextProps.played !== this.props.played) return true
      if (nextProps.time < nextProps.speech[0].start) return false
      if (nextProps.time > nextProps.speech.slice(-1)[0].end) return false
      return true
    }
*/
  , render: function() {
      const speechViews = functify(this.props.speech)
        .map(speech => {
          return (
            [ <SpeechView
                start={speech.start}
                text={speech.text}
                highlights={this.props.highlights.get(speech.index)}
                played={this.props.played || this.props.time > speech.end}
                onClick={this.props.onSpeechClick} />
            , ' '
            ])})
         .toArray()
      return (
        <div className={this.props.played ? 'turn played' : 'turn'}>
          <span className="speaker">{this.props.speaker}</span>
          <div style={{display: 'inline'}} ref="speech">{speechViews}</div>
        </div>
      )
    }
  }
)


'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import SpeechView from './transcript-speech'
import functify from 'functify'
import {progress} from './utils'

class TurnView extends React.Component {
  static propTypes =
    { highlights: React.PropTypes.instanceOf(Immutable.List)
    , index: React.PropTypes.number.isRequired
    , onMounted: React.PropTypes.func.isRequired
    , onSpeechClick: React.PropTypes.func.isRequired
    , progress: React.PropTypes.string
    , sentences: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
    , speaker: React.PropTypes.string.isRequired
    , speech: React.PropTypes.arrayOf(React.PropTypes.shape(
        { text: React.PropTypes.string
        , start: React.PropTypes.number
        , end: React.PropTypes.number
        })).isRequired
    , time: React.PropTypes.number.isRequired
    }
  static defaultProps =
    { highlights: Immutable.List.of()
    , progress: ''
    }
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this)
        , p = el.parentNode
        , bottom = (el) => el.offsetTop + el.offsetHeight
        , displayable = () => bottom(el) < bottom(p)
    var status, end
    if (displayable()) {
      status = 'ok'
      end = this.props.speech.slice(-1)[0].end
    } else {
      let nodes = this.refs.speech.getElementsByClassName('speech')
        , i = nodes.length - 1
      for (; i >= 0; i--) {
        nodes.item(i).style.display = 'none'
        if (displayable()) {
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
    this.props.onMounted(status, this.props.index, end)
  }
  render() {
    const speechViews = functify(this.props.speech)
      .map(speech => {
        return ([
          <SpeechView
            highlights={this.props.highlights.get(speech.index)}
            onClick={this.props.onSpeechClick}
            progress={progress(this.props.time, speech.start, speech.end)}
            start={speech.start}
            text={speech.text}
          />
        , ' '
        ])})
       .toArray()
    let className = 'turn ' + this.props.progress + ' p1'
    className += this.props.index % 2 ? ' bg-white' : ' bg-silver'
    return (
      <div
        className={className}
        style={{transition: 'color 0.4s ease'}}
      >
        <span className="bold mr1">{this.props.speaker}</span>
        <div
          className="inline"
          ref="speech"
        >{speechViews}</div>
      </div>
    )
  }
}
export default TurnView

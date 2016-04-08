'use strict'

import React from 'react'

class AudioPlayer extends React.Component {
  static propTypes =
    { media: React.PropTypes.string.isRequired
    , onEnded: React.PropTypes.func.isRequired
    , onPause: React.PropTypes.func.isRequired
    , onPlaying: React.PropTypes.func.isRequired
    , onTimeUpdate: React.PropTypes.func.isRequired
    , play: React.PropTypes.bool
    , seekTime: React.PropTypes.number
    };
  static defaultProps = {play: false, seekTime: null};
  constructor(props) {
    super(props)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    this.handlePause = this.handlePause.bind(this)
    this.handlePlaying = this.handlePlaying.bind(this)
    this.handleEnded = this.handleEnded.bind(this)
  }
  componentDidMount() {
    this.seek()
  }
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.media !== this.props.media ||
      nextProps.play !== this.props.play ||
      nextProps.seekTime !== this.props.seekTime
    )
  }
  componentDidUpdate() {
    this.seek()
  }
  handleTimeUpdate() {
    this.props.onTimeUpdate(this.refs.audio.currentTime)
  }
  handlePause() {
    this.props.onPause()
  }
  handlePlaying() {
    this.props.onPlaying()
    this.props.onEnded(false)
  }
  handleEnded() {
    this.props.onEnded(true)
  }
  seek() {
    if (this.props.seekTime !== null) {
      this.refs.audio.currentTime = this.props.seekTime
    }
    if (this.props.play) {
      this.refs.audio.play()
    } else {
      this.refs.audio.pause()
    }
  }
  render() {
    return (
      <div>
        <audio
          controls
          onCanPlay={this.handleCanPlay}
          onEnded={this.handleEnded}
          onPause={this.handlePause}
          onPlaying={this.handlePlaying}
          onTimeUpdate={this.handleTimeUpdate}
          ref="audio"
          src={this.props.media}
          style={{width: '100%'}}
        ></audio>
      </div>
    )
  }
}
export default AudioPlayer

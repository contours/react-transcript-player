'use strict'

import React from 'react'

class AudioPlayer extends React.Component {
  static propTypes =
    { media: React.PropTypes.string.isRequired
    , onEnded: React.PropTypes.func.isRequired
    , onTimeUpdate: React.PropTypes.func.isRequired
    , seekTime: React.PropTypes.number
    };
  static defaultProps = {seekTime: null};
  constructor(props) {
    super(props)
    this.handleCanPlay = this.handleCanPlay.bind(this)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
    this.handlePlaying = this.handlePlaying.bind(this)
    this.handleEnded = this.handleEnded.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (this.props.seekTime !== prevProps.seekTime) {
      this.seek()
    }
  }
  handleCanPlay() {
    this.seek()
  }
  handleTimeUpdate() {
    this.props.onTimeUpdate(this.refs.audio.currentTime)
  }
  handlePlaying() {
    this.props.onEnded(false)
  }
  handleEnded() {
    this.props.onEnded(true)
  }
  seek() {
    if (this.props.seekTime !== null) {
      this.refs.audio.currentTime = this.props.seekTime
    }
  }
  render() {
    return (
      <div>
        <audio
          controls
          onCanPlay={this.handleCanPlay}
          onEnded={this.handleEnded}
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

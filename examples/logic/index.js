'use strict'

var React = require('react')
  , ReactDOM = require('react-dom')
  , TranscriptPlayer = require('react-transcript-player').default
  , transcript = require('./media/transcript.json')

ReactDOM.render(
  React.createElement(TranscriptPlayer, {transcript: transcript}),
  document.getElementById('mount'))

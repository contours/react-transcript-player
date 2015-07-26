'use strict'

var React = require('react')
  , TranscriptPlayer = require('react-transcript-player')
  , transcript = require('./media/transcript.json')

React.render(
  React.createElement(
    TranscriptPlayer, {transcript: transcript, maxHeight: 600}),
  document.getElementById('mount'))

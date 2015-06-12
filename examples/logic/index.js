'use strict'

var React = require('react')
  , TranscriptPlayer = require('react-transcript-player')
  , transcript = require('./media/transcript.json')

//React.render(<TranscriptPlayer transcript={transcript}/>, document.body)
React.render(
  React.createElement(TranscriptPlayer, {transcript: transcript}),
  document.getElementById('mount'))

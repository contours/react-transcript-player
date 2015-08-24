'use strict'

const Immutable = require('immutable')
    , createIntervalTree = require('interval-tree-1d')

const matchesToIntervals = (matches) => {
  return matches.map(match => [match.index, match.index + match[0].length])
}

const findSpeechOffsets = (speech) => {
  return speech.reduce(([start, offsets], segment) => {
    let end = start + segment.text.length
    offsets.push([start, end])
    return [ end + 1, offsets ]
  }, [0, []])[1]
}

const findMatchOffsets = (speech, matches) => {
  const tree = createIntervalTree(matchesToIntervals(matches))
  return findSpeechOffsets(speech).map(([start, end]) => {
    let highlights = []
    tree.queryInterval(start, end, (match) => {
      highlights.push(
        [ Math.max(0, match[0] - start)
        , Math.min(end - start, match[1] - start)
        ])
    })
    return highlights.sort((a, b) => a[0] - b[0])
  })
}

const buildMatchIndex = (turns, re=null) => {
  return Immutable.fromJS(turns.map(turn => {
    const text = turn.sentences.join(' ')
    let match, matches = []
    if (re !== null) {
      while ((match = re.exec(text)) !== null) {
        matches.push(match)
      }
    }
    return findMatchOffsets(turn.speech, matches)
  }))
}

module.exports =
  { matchesToIntervals
  , findSpeechOffsets
  , findMatchOffsets
  , buildMatchIndex }

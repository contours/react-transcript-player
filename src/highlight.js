'use strict'

const createIntervalTree = require('interval-tree-1d')

const findSpeechOffsets = (speech) => {
  return speech.reduce(([start, offsets], segment) => {
    let end = start + segment.text.length
    offsets.push([start, end])
    return [ end + 1, offsets ]
  }, [0, []])[1]
}

const findMatchOffsets = (matches) => {
  return matches.map(match => [match.index, match.index + match[0].length])
}

const findHighlightOffsets = (speech, matches) => {
  const tree = createIntervalTree(findMatchOffsets(matches))
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

const highlight = (text, ranges) => {
  ranges = ranges
    .filter(range => range[0] !== range[1])
    .sort((a, b) => a[0] - b[0])
  if (ranges.length === 0) {
    return [[false, text]]
  }
  return ranges.map((range, i) => {
    let start = i > 0 ? ranges[i - 1][1] : 0
      , parts = []
    if (range[1] < range[0]) {
      throw `illegal range: ${range}`
    }
    if (i > 0 && range[0] < ranges[i - 1][1]) {
      throw 'highlighted ranges cannot overlap'
    }
    if (range[0] > start) {
      parts.push([false, text.slice(start, range[0])])
    }
    parts.push([true, text.slice(...range)])
    if (i + 1 === ranges.length && range[1] < text.length) {
      parts.push([false, text.slice(range[1])])
    }
    return parts
  }).reduce((a, b) => a.concat(b), [])
}

module.exports =
  { findSpeechOffsets
  , findMatchOffsets
  , findHighlightOffsets
  , highlight }


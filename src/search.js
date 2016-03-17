'use strict'

import {fromJS, List, Map} from 'immutable'
import createIntervalTree from 'interval-tree-1d'

export const matchesToIntervals = (matches) => {
  return matches.map(
    match => List.of(match.index, match.index + match[0].length))
}

export const findSpeechOffsets = (speech) => {
  return speech.reduce(([start, offsets], segment) => {
    let end = start + segment.get('text').length
    offsets.push([start, end])
    return [ end + 1, offsets ]
  }, [0, []])[1]
}

export const findMatchOffsets = (speech, matches) => {
  const speechOffsets = findSpeechOffsets(speech)
      , tree = createIntervalTree(speechOffsets)
  return matchesToIntervals(matches).map(([start, end]) => {
    let matchOffsets = Map()
    tree.queryInterval(start, end, (offset) => {
      let i = speechOffsets.indexOf(offset)
      matchOffsets = matchOffsets.set(i, List.of(
        Math.max(0, start - offset[0]),
        Math.min(offset[1] - offset[0], end - offset[0]))
      )
    })
    return matchOffsets
  })
}

export const buildMatchIndex = (turns, re) => {
  return turns.reduce((index, turn, turn_idx) => {
    const text = turn.get('sentences').join(' ')
    let match = [], matches = List()
    if (re !== null) {
      while ((match = re.exec(text)) !== null) {
        matches = matches.push(match)
      }
    }
    if (matches.size > 0) {
      index = index.set(turn_idx, findMatchOffsets(turn.get('speech'), matches))
    }
    return index
  }, Map())
}

export const execute = (turns, re=null) => {
  turns = fromJS(turns)
  const index = buildMatchIndex(turns, re)
  let times = List()
    , count = 0
  for (let [turn_idx, matches] of index.entries()) {
    count += matches.size
    times = times.concat(
      matches.map(match => {
        let speech_idx = match.keySeq().sort().first()
        return turns.get(turn_idx).get('speech').get(speech_idx).get('start')
      })
    )
  }
  return Map({ matches: index, times, count })
}

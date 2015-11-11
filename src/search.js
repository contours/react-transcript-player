'use strict'

import Immutable from 'immutable'
import createIntervalTree from 'interval-tree-1d'

export const matchesToIntervals = (matches) => {
  return matches.map(match => [match.index, match.index + match[0].length])
}

export const findSpeechOffsets = (speech) => {
  return speech.reduce(([start, offsets], segment) => {
    let end = start + segment.text.length
    offsets.push([start, end])
    return [ end + 1, offsets ]
  }, [0, []])[1]
}

export const findMatchOffsets = (speech, matches) => {
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

export const buildMatchIndex = (turns, re) => {
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

export const execute = (turns, re=null) => {
  const matches = buildMatchIndex(turns, re)
  let times = Immutable.List()
  for (let [ti, t] of matches.entries()) {
    for (let [si, s] of t.entries()) {
      if (s.size > 0) times = times.push(turns[ti].speech[si].start)
    }
  }
  return Immutable.Map(
    { matches: matches
    , times: times
    , count: matches.flatten(2).size
    }
  )
}

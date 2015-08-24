'use strict'

const test = require('tape')
  , { matchesToIntervals
    , findSpeechOffsets
    , findMatchOffsets } = require('../search.js')

test('text findSpeechOffsets()', t => {
  const speech =
    [ {text: 'A man,'}
    , {text: 'a'}
    , {text: 'plan,'}
    , {text: 'Panamanian.'}
    ]
  const expected = [[0, 6], [7, 8], [9, 14], [15, 26]]
  t.plan(1)
  t.deepEqual(findSpeechOffsets(speech), expected)
})

test('text matchesToIntervals()', t => {
  const matches =
    [ {index: 3, 0: {length: 2}}
    , {index: 11, 0: {length: 2}}
    , {index: 16, 0: {length: 2}}
    , {index: 20, 0: {length: 2}}
    , {index: 23, 0: {length: 2}}
    ]
  const expected = [[3, 5], [11, 13], [16, 18], [20, 22], [23, 25]]
  t.plan(1)
  t.deepEqual(matchesToIntervals(matches), expected)
})

test('test findMatchOffsets()', t => {
  // A man, a plan, Panamanian. Foo bar.
  // ---34------12---67--01-34--7890123-
  const speech =
    [ {text: 'A man,'}
    , {text: 'a'}
    , {text: 'plan,'}
    , {text: 'Panamanian.'}
    , {text: 'Foo'}
    , {text: 'bar.'}
    ]
      , matches =
    [ {index: 3, 0: {length: 2}}
    , {index: 11, 0: {length: 2}}
    , {index: 16, 0: {length: 2}}
    , {index: 20, 0: {length: 2}}
    , {index: 23, 0: {length: 2}}
    , {index: 27, 0: {length: 7}}
    ]
  const expected =
    [ [ [3, 5] ]
    , []
    , [ [2, 4] ]
    , [ [1, 3], [5, 7], [8, 10] ]
    , [ [0, 3] ]
    , [ [0, 3] ]
    ]
  t.plan(1)
  t.deepEqual(findMatchOffsets(speech, matches), expected)
})


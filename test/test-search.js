'use strict'

const test = require('tape')
    , Immutable = require('immutable')
    , { matchesToIntervals
      , findSpeechOffsets
      , findMatchOffsets } = require('../search.js')

test('test findSpeechOffsets()', t => {
  const speech =  Immutable.fromJS(
    [ {text: 'A man,'}
    , {text: 'a'}
    , {text: 'plan,'}
    , {text: 'Panamanian.'}
    ])
  const expected = [[0, 6], [7, 8], [9, 14], [15, 26]]
  t.plan(1)
  t.deepEqual(findSpeechOffsets(speech), expected)
})

test('test matchesToIntervals()', t => {
  const matches = Immutable.List.of
    ( {index: 3, 0: {length: 2}}
    , {index: 11, 0: {length: 2}}
    , {index: 16, 0: {length: 2}}
    , {index: 20, 0: {length: 2}}
    , {index: 23, 0: {length: 2}}
    )
  const expected = [[3, 5], [11, 13], [16, 18], [20, 22], [23, 25]]
  t.plan(1)
  t.deepEqual(matchesToIntervals(matches).toJS(), expected)
})

test('test findMatchOffsets()', t => {
  // A man, a plan, Panamanian. Foo bar.
  // ---34------12---67--01-34--7890123-
  const segments = Immutable.fromJS(
    [ {text: 'A man,'}      // 0
    , {text: 'a'}           // 1
    , {text: 'plan,'}       // 2
    , {text: 'Panamanian.'} // 3
    , {text: 'Foo'}         // 4
    , {text: 'bar.'}        // 5
    ])
      , matches = Immutable.List.of
    ( {index:  3, 0: {length: 2}}
    , {index: 11, 0: {length: 2}}
    , {index: 16, 0: {length: 2}}
    , {index: 20, 0: {length: 2}}
    , {index: 23, 0: {length: 2}}
    , {index: 27, 0: {length: 7}}
    )
  const expected =
//seg idx: matching ranges
    [ { 0: [ 3,  5 ] }
    , { 2: [ 2,  4 ] }
    , { 3: [ 1,  3 ] } //
    , { 3: [ 5,  7 ] } // 3 matches within 1 segment
    , { 3: [ 8, 10 ] } //

    , { 4: [ 0,  3 ]    //
      , 5: [ 0,  3 ]    // 1 match overlapping 2 segments
      }                 //
    ]
  t.plan(1)
  t.deepEqual(findMatchOffsets(segments, matches).toJS(), expected)
})

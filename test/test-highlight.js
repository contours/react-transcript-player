'use strict'

const test = require('tape')
  , { findSpeechOffsets
    , findMatchOffsets
    , findHighlightOffsets
    , highlight } = require('../highlight.js')

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

test('text findMatchOffsets()', t => {
  const matches =
    [ {index: 3, 0: {length: 2}}
    , {index: 11, 0: {length: 2}}
    , {index: 16, 0: {length: 2}}
    , {index: 20, 0: {length: 2}}
    , {index: 23, 0: {length: 2}}
    ]
  const expected = [[3, 5], [11, 13], [16, 18], [20, 22], [23, 25]]
  t.plan(1)
  t.deepEqual(findMatchOffsets(matches), expected)
})

test('test findHighlightOffsets()', t => {
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
  t.deepEqual(findHighlightOffsets(speech, matches), expected)
})

test('test highlight', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = [[1, 2], [4, 5]]
      , expected =
          [ [false, 'A']
          , [true, ' ']
          , [false, 'ma']
          , [true, 'n']
          , [false, ', a plan, Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight disordered', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = [[4, 5], [1, 2]]
      , expected =
          [ [false, 'A']
          , [true, ' ']
          , [false, 'ma']
          , [true, 'n']
          , [false, ', a plan, Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight nothing', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = []
      , expected = [ [false, 'A man, a plan, Panama!'] ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight zero range', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = [[0, 5], [6, 6]]
      , expected =
          [ [true, 'A man']
          , [false, ', a plan, Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight at start', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = [[0, 5]]
      , expected =
          [ [true, 'A man']
          , [false, ', a plan, Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight at end', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = [[15, 22]]
      , expected =
          [ [false, 'A man, a plan, ']
          , [true, 'Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight adjacent ranges', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = [[1, 2], [2, 3]]
      , expected =
          [ [false, 'A']
          , [true, ' ']
          , [true, 'm']
          , [false, 'an, a plan, Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight overlapping ranges', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = [[1, 5], [3, 7]]
  t.plan(1)
  t.throws(() => highlight(text, ranges))
})

test('test highlight backwards ranges', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = [[2, 1]]
  t.plan(1)
  t.throws(() => highlight(text, ranges))
})


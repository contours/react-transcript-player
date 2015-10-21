'use strict'

const test = require('tape')
    , Immutable = require('immutable')
    , highlight = require('../highlight.js')

test('test highlight', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = Immutable.fromJS([[1, 2], [4, 5]])
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
      , ranges = Immutable.fromJS([[4, 5], [1, 2]])
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
      , ranges = Immutable.fromJS([])
      , expected = [ [false, 'A man, a plan, Panama!'] ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight zero range', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = Immutable.fromJS([[0, 5], [6, 6]])
      , expected =
          [ [true, 'A man']
          , [false, ', a plan, Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight at start', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = Immutable.fromJS([[0, 5]])
      , expected =
          [ [true, 'A man']
          , [false, ', a plan, Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight at end', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = Immutable.fromJS([[15, 22]])
      , expected =
          [ [false, 'A man, a plan, ']
          , [true, 'Panama!']
          ]
  t.plan(1)
  t.deepEqual(highlight(text, ranges), expected)
})

test('test highlight adjacent ranges', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = Immutable.fromJS([[1, 2], [2, 3]])
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
      , ranges = Immutable.fromJS([[1, 5], [3, 7]])
  t.plan(1)
  t.throws(() => highlight(text, ranges))
})

test('test highlight backwards ranges', t => {
  const text = 'A man, a plan, Panama!'
      , ranges = Immutable.fromJS([[2, 1]])
  t.plan(1)
  t.throws(() => highlight(text, ranges))
})


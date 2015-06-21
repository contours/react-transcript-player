'use strict'

var test = require('tape')
  , {functify} = require('functify')
  , {range, enumerate} = require('../itertools.js')

test('test range()', t => {
  const expected = []
  var index = 0
  t.plan(7)
  for (let i = 0; i < 7; i++) {
    expected.push(i)
  }
  for (let actual of range()) {
    if (index === expected.length) break
    t.equal(actual, expected[index++])
  }
})

test('test range(3)', t => {
  const expected = []
  var index = 0
  t.plan(7)
  for (let i = 3; i < 10; i++) {
    expected.push(i)
  }
  for (let actual of range(3)) {
    if (index === expected.length) break
    t.equal(actual, expected[index++])
  }
})

test('test range(3, 10)', t => {
  const expected = []
  var index = 0
  t.plan(7)
  for (let i = 3; i < 10; i++) {
    expected.push(i)
  }
  for (let actual of range(3, 10)) {
    t.equal(actual, expected[index++])
  }
})

test('test range(3, 10, 2)', t => {
  const expected = []
  var index = 0
  t.plan(4)
  for (let i = 3; i < 10; i += 2) {
    expected.push(i)
  }
  for (let actual of range(3, 10, 2)) {
    t.equal(actual, expected[index++])
  }
})

test('test range(3, undefined, -2)', t => {
  const expected = []
  var index = 0
  t.plan(4)
  for (let i = 3; i > -4; i -= 2) {
    expected.push(i)
  }
  for (let actual of range(3, undefined, -2)) {
    if (index === expected.length) break
    t.equal(actual, expected[index++])
  }
})

test('test range(3, 10, -2)', t => {
  t.plan(1)
  t.deepEqual(range(3, 10, -2).toArray(), [])
})

test('test range(-3)', t => {
  const expected = []
  var index = 0
  t.plan(7)
  for (let i = -3; i < 4; i++) {
    expected.push(i)
  }
  for (let actual of range(-3)) {
    if (index === expected.length) break
    t.equal(actual, expected[index++])
  }
})

test('test range(1, 2, 0)', t => {
  const expected = [1, 1, 1, 1, 1]
  var index = 0
  t.plan(5)
  for (let actual of range(1, 2, 0)) {
    if (index === expected.length) break
    t.equal(actual, expected[index++])
  }
})

test('test enumerate()', t => {
  const expected = [[0, 'a'], [1, 'b'], [2, 'c']]
  t.plan(1)
  t.deepEqual(enumerate(functify(['a', 'b', 'c'])).toArray(), expected)
})

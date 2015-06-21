"use strict"

var {Functified} = require('functify')

const range = (start=0, stop=undefined, step=1) => {
  return Functified.fromGenerator(function* () {
    const notYet = (step >= 0) ? x => (x < stop) : x => (x > stop)
    let i = start
    while (stop === undefined || notYet(i)) {
      yield i
      i += step
    }
  })
}

module.exports =
  { range: range
  , enumerate: iterable => Functified.zip([range(), iterable])
  }


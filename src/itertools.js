"use strict"

import functify from 'functify'

export const range = (start=0, stop=undefined, step=1) => {
  return functify.fromGenerator(function* () {
    const notYet = (step >= 0) ? x => (x < stop) : x => (x > stop)
    let i = start
    while (stop === undefined || notYet(i)) {
      yield i
      i += step
    }
  })
}

export const enumerate = iterable => functify.zip([range(), iterable])

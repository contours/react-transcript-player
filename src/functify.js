"use strict"

// Copied from https://github.com/kevinbarabash/functify because I was
// running into problems with using the Babel runtime with the npm package
// of functify.

class Functified {

  constructor(iterable) {
    this.iterable = iterable
    this.isFunctified = true
  }

  *[Symbol.iterator]() {
    for (let value of this.iterable) {
      yield value
    }
  }

  enumerate() {
    return Functified.zip([Functified.range(), this.iterable])
  }

  filter(callback) {
    var iterable = this.iterable
    return Functified.fromGenerator(function* () {
      for (let value of iterable) {
        if (callback(value)) {
          yield value
        }
      }
    })
  }

  flatten() {
    var iterable = this.iterable
    return Functified.fromGenerator(function* () {
      for (let value of iterable) {
        if (value[Symbol.iterator]) {
          yield* functify(value).flatten()
        } else {
          yield value
        }
      }
    })
  }

  map(callback) {
    var iterable = this.iterable
    return Functified.fromGenerator(function* () {
      for (let value of iterable) {
        yield callback(value)
      }
    })
  }

  skipWhile(predicate) {
    var iterable = this.iterable
    return Functified.fromGenerator(function* () {
      var skip = true
      for (let value of iterable) {
        if (!predicate(value)) {
          skip = false
        }
        if (!skip) {
          yield value
        }
      }
    })
  }

  takeUntil(predicate) {
    var iterator = this.iterable[Symbol.iterator]()
    var self = this
    return Functified.fromGenerator(function* () {
      if (self.hasOwnProperty("startValue") && self.isPausable) {
        yield self.startValue
      }
      for (;;) {
        var result = iterator.next()
        if (result.done) {
          break
        } else {
          if (predicate(result.value)) {
            // save the value so we can yield if takeUntil is called again
            self.startValue = result.value
            break
          } else {
            yield result.value
          }
        }
      }
    })
  }

  reduce(callback, initialValue) {
    let accum = initialValue
    let iterator = this.iterable[Symbol.iterator]()

    if (accum === undefined) {
      let result = iterator.next()
      if (result.done) {
        throw "not enough values to reduce"
      } else {
        accum = result.value
      }
    }

    for (;;) {
      let result = iterator.next()
      if (result.done) {
        break
      } else {
        accum = callback(accum, result.value)
      }
    }

    return accum
  }

  entries() {
    if (this.iterable.entries) {
      return new Functified(this.iterable.entries())
    } else {
      throw "doesn't have entries"
    }
  }

  toArray() {
    var result = []
    for (let value of this.iterable) {
      result.push(value)
    }
    return result
  }

  // static methods
  static fromGenerator(generator) {
    return functify({
      [Symbol.iterator]: generator
    })
  }

  static fromObject(obj) {
    return functify(
      {[Symbol.iterator]: function* () {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            yield [key, obj[key]]
          }
        }
      }
      , entries() {
        return Functified.fromGenerator(function* () {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              yield [key, obj[key]]
            }
          }
        })
      }
      , keys() {
        return Functified.fromGenerator(function* () {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              yield key
            }
          }
        })
      }
      , values() {
        return Functified.fromGenerator(function* () {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              yield obj[key]
            }
          }
        })
      }
    })
  }

  static range(start=0, stop=undefined, step=1) {
    return Functified.fromGenerator(function* () {
      const notYet = (step >= 0) ? x => (x < stop) : x => (x > stop)
      let i = start
      while (stop === undefined || notYet(i)) {
        yield i
        i += step
      }
    })
  }

  static zip(...iterables) {
    // assume if a single value is passed in it must contain an array
    if (iterables.length === 1) {
      iterables = iterables[0]
    }
    return Functified.fromGenerator(function* () {
      var iterators = iterables.map(iterable => {
        if (iterable[Symbol.iterator]) {
          return iterable[Symbol.iterator]()
        } else {
          throw "can't zip a non-iterable"
        }
      })
      for (;;) {
        let vector = []
        for (let iterator of iterators) {
          var result = iterator.next()
          if (result.done) {
            return // finished
          } else {
            vector.push(result.value)
          }
        }
        yield vector
      }
    })
  }
}

function functify(iterable) {
  // avoid re-wrapping iterables that have already been Functified
  if (iterable.isFunctified) {
    return iterable
  } else if (!iterable[Symbol.iterator]) {
    return Functified.fromObject(iterable)
  } else {
    return new Functified(iterable)
  }
}

functify.fromGenerator = Functified.fromGenerator
functify.range = Functified.range
functify.zip = Functified.zip

export default functify

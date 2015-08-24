'use strict'

module.exports = (text, ranges) => {
  ranges = ranges
    .filter(range => range.get(0) !== range.get(1))
    .sort((a, b) => a.get(0) - b.get(0))
  if (ranges.size === 0) {
    return [[false, text]]
  }
  return ranges.map((range, i) => {
    let start = i > 0 ? ranges.get(i - 1).get(1) : 0
      , parts = []
    if (range.get(1) < range.get(0)) {
      throw `illegal range: ${range}`
    }
    if (i > 0 && range.get(0) < ranges.get(i - 1).get(1)) {
      throw 'highlighted ranges cannot overlap'
    }
    if (range.get(0) > start) {
      parts.push([false, text.slice(start, range.get(0))])
    }
    parts.push([true, text.slice(range.get(0), range.get(1))])
    if (i + 1 === ranges.size && range.get(1) < text.length) {
      parts.push([false, text.slice(range.get(1))])
    }
    return parts
  }).reduce((a, b) => a.concat(b), [])
}


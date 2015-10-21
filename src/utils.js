"use strict"

const progress = (time, start, end) => {
  if (time < start) return ''
  if (time > end + 500) return 'played'
  return 'playing'
}

module.exports = {progress: progress}

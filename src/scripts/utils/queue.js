class Queue {
  constructor () {
    this.promise = Promise.resolve()
  }
  add (action) {
    this.promise = this.promise.then(() => action())
  }
  done () {
    return this.promise
  }
}

module.exports = Queue

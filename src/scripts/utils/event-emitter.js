class EventEmitter {
  constructor () {
    this._listeners = []
  }

  on (name, callback) {
    this._listeners.push({
      name,
      callback,
    })
  }

  emit (name, ...args) {
    this._listeners.forEach((listener) => {
      if (listener.name === name) {
        listener.callback(...args)
      }
    })
  }

  removeListener (name, callback) {
    this._listeners = this._listeners.filter((listener) =>
      (listener.name === name) && (callback ? listener.callback === callback : true)
    )
  }

  removeListeners () {
    this._listeners = []
  }
}

module.exports = EventEmitter

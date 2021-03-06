const EventEmitter = require('component-emitter')

const DEFAULT_COOKIES_OPTIONS = {
  domain: '',
  path: '/',
  expirationDate: (+(new Date()) + (10 * 365 * 24 * 3600 * 1000)) / 1000, // 10 years later
  hostOnly: false,
  httpOnly: false,
  secure: false,
  session: false,
  storeId: null,
  sameSite: 'unspecified',
}

function without (array, matcher) {
  let index = array.findIndex(matcher)
  if (!~index) {
    return array
  }
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

class Jar {
  constructor (json) {
    this._hooks = new EventEmitter()
    this._cookies = []
    try {
      let object = JSON.parse(json)
      if (!Array.isArray(object)) {
        throw new Error()
      }
      this._cookies = object
    } catch (error) {
      throw new Error($l10n('PLEASE_SET_COOKIES_IN_JSON_ARRAY_FORMAT'))
    }
  }

  set (name, value, options = {}) {
    options = {
      ...DEFAULT_COOKIES_OPTIONS,
      ...options,
    }
    let newer = without(this._cookies, (cookie) => cookie.name === name)
    newer.push({
      name,
      value,
      ...options,
    })
    this._cookies = newer
    this._hooks.emit('update', newer)
  }

  remove (name) {
    let newer = without(this._cookies, (cookie) => cookie.name === name)
    this._cookies = newer
    this._hooks.emit('update', newer)
  }

  values () {
    return this._cookies
  }

  static stringify (cookies) {
    return cookies
      .map((item) => `${item.name}=${item.value}`)
      .join(';')
  }
}

class JarInPrefs extends Jar {
  constructor (prefKey) {
    const cookiesJSON = $prefs.get(prefKey)
    if (!cookiesJSON) {
      throw new Error($l10n('PLEASE_SET_COOKIES_FIRST'))
    }
    super(cookiesJSON)
    this._hooks.on('update', (newer) => {
      $prefs.set(prefKey, JSON.stringify(newer, null, 2))
    })
  }
}

exports.Jar = Jar
exports.JarInPrefs = JarInPrefs

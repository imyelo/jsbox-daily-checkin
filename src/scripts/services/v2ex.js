const { PREFS } = require('../constant')
const { Jar, JarInPrefs } = require('../utils/jar')

const action = async () => {
  const jar = new JarInPrefs(PREFS.V2EX_COOKIES)

  const getHeader = ({ cookies }) => ({
    'Pragma': 'no-cache',
    'Cookie': cookies,
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Cache-Control': 'no-cache',
    'Referer': 'https://www.v2ex.com/',
  })

  let request = (() => {
    const doRequest = ({ method, url, jar }) => {
      const cookies = Jar.stringify(jar.values())
      const header = getHeader({ cookies })
      return $http.request({
        method,
        url,
        header,
      })
    }
    return {
      get: (url, options) => doRequest({ method: 'GET', url, ...options }),
      post: (url, options) => doRequest({ method: 'POST', url, ...options }),
    }
  })()

  class ServerApi {
    constructor ({ jar }) {
      this.jar = jar
    }

    async homepage () {
      const { data } = await request.get('https://www.v2ex.com/', { jar: this.jar })
      const isLoggedIn = data.includes('登出')
      return {
        isLoggedIn,
      }
    }

    async mission () {
      const { data } = await request.get('https://www.v2ex.com/mission/daily', { jar: this.jar })
      const isCompleted = data.includes('每日登录奖励已领取')
      const matched = data.match(/redeem\?once=(.*?)'/)
      const once = matched && matched[1]
      return {
        isCompleted,
        once,
      }
    }

    async checkin ({ once }) {
      const url = `https://www.v2ex.com/mission/daily/redeem?once=${encodeURIComponent(once)}`
      const result = await request.get(url, { jar: this.jar })
      return result.response.statusCode === 302 // TODO: double check this logic
    }

    async balance () {
      const { data } = await request.get('https://www.v2ex.com/balance', { jar: this.jar })
      const matched = data.match(/(\d+?)\s的每日登录奖励\s(\d+)\s铜币/)
      return {
        message: matched && matched[0],
        date: matched && matched[1],
        reward: matched && matched[2],
      }
    }
  }

  /**
   * refs: https://qiandao.today/tpl/8359/edit
   */
  const replay = async ({ jar }) => {
    let result
    const api = new ServerApi({ jar })
    result = await api.homepage()
    if (!result.isLoggedIn) {
      throw new Error($l10n('PROFILE_IS_EXPIRED'))
    }
    result = await api.mission()
    if (result.isCompleted) {
      throw new Error($l10n('HAVE_BEEN_CHECKED_IN_BEFORE'))
    }
    await api.checkin({ once: result.once })
    result = await api.mission()
    if (!result.isCompleted) {
      throw new Error($l10n('CHECKIN_PROGRAM_FAILURE'))
    }
    let { message } = await api.balance()
    if (!message) {
      throw new Error($l10n('CHECKIN_PROGRAM_FAILURE'))
    }
    return message
  }

  try {
    const result = await replay({ jar })
    return `🎉 ${$l10n('CHECKIN_SUCCESS')} ${result}`
  } catch (error) {
    console.log(error)
    // TODO: filter custom error
    return error.message
  }
}

module.exports = action

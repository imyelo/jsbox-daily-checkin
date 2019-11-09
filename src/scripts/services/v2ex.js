const { CACHE } = require('../constant')
const { Jar, JarInCache } = require('../utils/jar')

const action = async () => {
  const jar = new JarInCache(CACHE.V2EX_COOKIES)

  const getHeader = ({ cookies }) => ({
    'Pragma': 'no-cache',
    'Cookie': cookies,
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Cache-Control': 'no-cache',
    'Referer': 'https://www.v2ex.com/',
  })

  /**
   * refs: https://qiandao.today/tpl/8359/edit
   */
  const replay = async (jar) => {
    const cookies = Jar.stringify(jar.values())
    const header = getHeader({ cookies })

    let result, matched
    result = await $http.request({
      method: 'GET',
      url: 'https://www.v2ex.com/',
      header,
    })
    if (!result.data.includes('领取今日的登录奖励')) {
      throw new Error('TODO')
    }
    result = await $http.request({
      method: 'GET',
      url: 'https://www.v2ex.com/mission/daily',
      header,
    })
    if (result.data.includes('每日登录奖励已领取')) {
      throw new Error('TODO')
    }
    matched = result.data.match(/redeem\?once=(.*?)'/)
    if (!matched) {
      throw new Error('TODO')
    }
    let once = matched[1]
    result = await $http.request({
      method: 'GET',
      url: `https://www.v2ex.com/mission/daily/redeem?once=${encodeURIComponent(once)}`,
      header,
    })

    console.log(result)

    result = await $http.request({
      method: 'GET',
      url: 'https://www.v2ex.com/mission/daily',
      header,
    })
    if (!result.data.includes('每日登录奖励已领取')) {
      throw new Error('TODO')
    }
    result = await $http.request({
      method: 'GET',
      url: 'https://www.v2ex.com/balance',
      header,
    })
    if (!result.data.includes('当前账户余额')) {
      throw new Error('TODO')
    }
    matched = result.data.match(/\d+?\s的每日登录奖励\s\d+\s铜币/)
    if (!matched) {
      throw new Error('TODO')
    }

    return matched[1]
  }

  const result = await replay()

  return result
    ? `🎉 ${$l10n('CHECKIN_SUCCESS')} ${result}`
    : $l10n('CHECKIN_FAILURE')
}

module.exports = action

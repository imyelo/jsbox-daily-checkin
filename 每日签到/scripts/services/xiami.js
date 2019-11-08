const { CACHE } = require('../constant')
const { Jar, JarInCache } = require('../utils/jar')

const action = async () => {
  const jar = new JarInCache(CACHE.XIAMI_COOKIES)

  const check = async (jar) => {
    /**
     * refs:
     *  - https://github.com/ibukisaar/xiami_checkin/blob/master/CSharp%E8%99%BE%E7%B1%B3%E7%AD%BE%E5%88%B0/Program.cs
     */
    const HELPFUL_COOKIES = ['member_auth', 'user', 'login_method', 't_sign_auth']
    const cookies = Jar.stringify(
      jar.values()
        .filter((item) => !!~HELPFUL_COOKIES.indexOf(item.name))
    )

    const { data } = await $http.request({
      method: 'POST',
      url: 'https://emumo.xiami.com/task/signin',
      header: {
      'Accept': '*/*',
      'Cookie': cookies,
      'DNT': '1',
      'Origin': 'https://emumo.xiami.com',
      'Referer': 'https://emumo.xiami.com/',
      'Sec-Fetch-Mode': 'cors',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      },
    })
    const day = +data.trim()

    return day
  }

  const latestDay = await check(jar)
  jar.set('t_sign_auth', latestDay + 1, {
    domain: '.xiami.com',
  })
  const day = await check(jar)

  return day
    ? `🎉 ${$l10n('CHECKIN_SUCCESS')} ${day} ${$l10n('DAY')}`
    : $l10n('CHECKIN_FAILURE')
}

module.exports = action

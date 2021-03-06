const { PREFS } = require('../constant')
const { Jar, JarInPrefs } = require('../utils/jar')

const action = async () => {
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

  try {
    const jar = new JarInPrefs(PREFS.XIAMI_COOKIES)
    jar.remove('t_sign_auth')
    const latestDay = await check(jar)
    if (!latestDay) {
      throw new Error($l10n('CHECKIN_FAILURE'))
    }
    jar.set('t_sign_auth', latestDay, {
      domain: '.xiami.com',
    })
    const day = await check(jar)
    if (!day) {
      throw new Error($l10n('CHECKIN_FAILURE'))
    }

    if (day === latestDay) {
      throw new Error($l10n('HAVE_BEEN_CHECKED_IN_BEFORE'))
    }

    return `🎉 ${$l10n('CHECKIN_SUCCESS')} ${day} ${$l10n('DAY')}`
  } catch (error) {
    console.log(error)
    return error.message
  }
}

module.exports = action

const services = require('../services/index')
const router = require('../utils/router')

const menu = [
  {
    title: $l10n('XIAMI'),
    rows: [
      {
        title: `🙋 ${$l10n('CHECKIN')}`,
        action: async () => {
          let result = await services.get($l10n('XIAMI'))()
          $ui.alert(result)
        },
      },
      {
        title: `⚙️ ${$l10n('SET_COOKIES')}`,
        action: async () => {
          try {
            router.push('xiami-set-cookies')
          } catch (error) {
            console.log(error)
          }
        },
      },
    ],
  },
  {
    title: $l10n('V2EX'),
    rows: [
      {
        title: `🙋 ${$l10n('CHECKIN')}`,
        action: async () => {
          let result = await services.get($l10n('V2EX'))()
          $ui.alert(result)
        },
      },
      {
        title: `⚙️ ${$l10n('SET_COOKIES')}`,
        action: async () => {
          try {
            router.push('v2ex-set-cookies')
          } catch (error) {
            console.log(error)
          }
        },
      },
    ],
  },
]

module.exports = () => ({
  views: [
    {
      type: 'list',
      props: {
        data: menu.map(({ title, rows}) => ({
          title,
          rows: rows.map(({ title }) => title),
        })),
        footer: {
          type: 'label',
          props: {
            height: 20,
            text: 'github.com/imyelo',
            textColor: $color('#AAAAAA'),
            align: $align.center,
            font: $font(12),
          },
        },
      },
      layout: $layout.fill,
      events: {
        didSelect: async (sender, { section, row }, tag) => {
          const { action } = menu[section].rows[row]
          await action()
        },
      },
    },
  ],
})

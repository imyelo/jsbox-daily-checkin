const services = require('../services/index')

const menu = [
  {
    title: `🙋 ${$l10n('CHECKIN_MANUALLY')}`,
    rows: [
      {
        title: `🍤 ${$l10n('XIAMI')}`,
        action: async () => {
          let result = await services.get($l10n('XIAMI'))()
          $ui.alert(result)
        },
      },
      {
        title: `👨‍💻 ${$l10n('V2EX')}`,
        action: async () => {
          let result = await services.get($l10n('V2EX'))()
          $ui.alert(result)
        },
      },
    ],
  },
  {
    title: `⚙️ ${$l10n('SETTINGS')}`,
    rows: [
      {
        title: `🎭 ${$l10n('PROFILES')}`,
        action: async () => {
          $prefs.open()
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

const { CACHE } = require('../constant')

module.exports = () => ({
  views: [
    {
      type: 'text',
      props: {
        text: $cache.get(CACHE.XIAMI_COOKIES),
        placeholder: $l10n('INSERT_XIAMI_COOKIES')
      },
      layout: $layout.fill,
    },
  ],
  props: {
    navButtons: [
      {
        title: $l10n('SAVE'),
        handler () {
          $cache.set(CACHE.XIAMI_COOKIES, $('text').text)
          $ui.pop()
          $ui.toast($l10n('SAVE_SUCCESS'))
        },
      },
    ],
  },
})

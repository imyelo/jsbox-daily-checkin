const { CACHE } = require('../constant')

module.exports = () => ({
  views: [
    {
      type: 'text',
      props: {
        text: $cache.get(CACHE.V2EX_COOKIES),
        placeholder: $l10n('INSERT_V2EX_COOKIES')
      },
      layout: $layout.fill,
    },
  ],
  props: {
    navButtons: [
      {
        title: $l10n('SAVE'),
        handler () {
          $cache.set(CACHE.V2EX_COOKIES, $('text').text)
          $ui.pop()
          $ui.toast($l10n('SAVE_SUCCESS'))
        },
      },
    ],
  },
})

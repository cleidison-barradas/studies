const a = require('babel-plugin-inline-react-svg')

module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true, // type-check stories during Storybook build
  },
  babel: async (options) => {
    options.plugins.push('babel-plugin-inline-react-svg')
    return options
  },
}

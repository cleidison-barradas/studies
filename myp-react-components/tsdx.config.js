const svg = require('rollup-plugin-svg')
const images = require('@rollup/plugin-image')
const copy = require('rollup-plugin-copy')
const image = require('rollup-plugin-img')
const typescript = require('@rollup/plugin-typescript')
const alias = require('@rollup/plugin-alias')

module.exports = {
  rollup(config, options) {
    config.plugins.push(images())
    config.plugins.push(svg())
    config.plugins.push(copy({}))
    config.plugins.push(typescript())

    return config
  },
}

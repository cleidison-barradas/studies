const handlebars = require('handlebars')
const fs = require('fs')
/**
 * 
 * @param {Object} options 
 * @param {String} options.template 
 * @param {Object} options.variables 
 */
module.exports = async ({ template, variables }) => {
  const templateFileContent = await fs.promises.readFile(template, {
    encoding: 'utf-8'
  })
  
  const parseTemplate = handlebars.compile(templateFileContent)

  return parseTemplate(variables)
}
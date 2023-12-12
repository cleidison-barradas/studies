import { compile } from 'handlebars'
import { promises } from 'fs'

interface ParseDTO {
  template: string,
  variables: Object
}

export async function parseTemplate ({ template, variables }: ParseDTO) {
  const templateFileContent = await promises.readFile(template, { encoding: 'utf-8' })
  const templateParsed = compile(templateFileContent)

  return templateParsed(variables)
}
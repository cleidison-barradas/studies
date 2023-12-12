import * as fs from 'fs'
import * as path from 'path'
import { getProductsInfo } from '../utils/getProductsInfo'
import chalk from 'chalk'

interface Counters {
  validImage: number,
  modifiedProduct: number
}

class UploadReport {
  async createBeforeReport(mainPath: string): Promise<void> {
    mainPath = path.join(mainPath, 'Imagens_Anteriores.txt')

    const productsWithImage = await getProductsInfo()

    console.log(chalk.gray('Gerando Relatório de Produtos que tinham imagens anteriores...\n'))

    try {
      await fs.promises.writeFile(mainPath,
        `---------- Dados anteriores a atualização das imagens ----------\nAtualmente temos ${productsWithImage} produtos com imagens válidas.`)
    } catch (err) {
      console.log(chalk.red.bold('Relatório de Produtos que tinham imagens anteriores não foi gerado!\n'))
    }

    if (fs.existsSync(mainPath)) {
      console.log(chalk.green('Relatório de Produtos que tinham imagens anteriores gerado!\n'))
    } else {
      console.log(chalk.red.bold('Relatório de Produtos que tinham imagens anteriores não foi gerado!\n Tentando novamente...'))
      this.createBeforeReport(mainPath)
    }

  }

  async createReports (mainPath: string): Promise<void> {

    mainPath = path.join(mainPath, 'Reports')


    try {
      await fs.promises.mkdir(path.join(mainPath, 'Reports'), { recursive: true })
      console.log(chalk.green.bold('Diretório de relatórios criado com sucesso!\n'))

      //EANs não cadastrados.
      await fs.promises.writeFile(path.join(mainPath, 'EANs-Não-Cadastrados.txt'),`---------- EANs que tem Imagem e não tem no nosso banco ----------\nAtenção: Aqui você poderá encontrar produtos tarjados.\n`)

      //Relatórios de Imagens Anteriores
      await this.createBeforeReport(mainPath)

      //Relatório dos Uploads
      await fs.promises.writeFile(path.join(mainPath, 'Relatório_de_Upload.txt'),
        '---------- Dados sobre a atualização das imagens ----------\n'
      )
    } catch (err) {
      console.log(chalk.red.bold('Erro ao gerar os relatórios.\n'), err)
    }
  }

  async uploadReport(mainPath: string, counters?: Counters, count?: number): Promise<void> {
    mainPath = path.join(mainPath, 'Reports', 'Relatório_de_Upload.txt')

    console.log(chalk.yellow('Atualizando o relatório das imagens que subiram para a AWS S3...'))

    const content = fs.readFileSync(mainPath, 'utf-8')

    const rows = content.split('\n')

    try {
      rows[1] = `Dos produtos da nossa base percorridos, ${counters.validImage} são produtos com imagens válidas.`
      rows[2] = `Foram atualizados ${counters.modifiedProduct} produtos com imagens válidas.`
      rows[3] = `Já foi percorrido ${count} produtos da pasta escolhida.`


      const newContent = rows.join('\n')

      fs.writeFileSync(mainPath, newContent, 'utf-8')

      console.log(chalk.yellow('Relatório atualizado!'))

    } catch (err) {
      console.log(chalk.red.bold('Erro ao atualizar o relatório dos uploads!\n Tentando novamente...'))
      this.uploadReport(mainPath, counters)
    }

  }

  async updateImagesCounter(mainPath: string, count: number): Promise<void> {
    mainPath = path.join(mainPath, 'Reports', 'Relatório_de_Upload.txt')

    const content = fs.readFileSync(mainPath, 'utf-8')

    const rows = content.split('\n')

    try {
      rows[rows.length] = `Já foi percorrido ${count} produtos da pasta escolhida.\n`

      const newContent = rows.join('\n')

      fs.writeFileSync(mainPath, newContent, 'utf-8')

    } catch (err) {
      console.log(chalk.red.bold('Erro ao atualizar o relatório dos uploads!\n Tentando novamente...'))
      this.updateImagesCounter(mainPath, count)
    }
  }

  async addUnregistrerEAN (mainPath: string, unregistrerEAN: string): Promise<void> {
    mainPath = path.join(mainPath, 'Reports', 'EANs-Não-Cadastrados.txt')

    try {
      await fs.promises.appendFile(mainPath, `${unregistrerEAN} não está na nossa base de dados\n`)
    } catch (err) {
      console.log(chalk.red.bold('Não foi possível atualizar o relatório de EANs não Cadastrados!\n'), err)
    }
  }

}

export { UploadReport }

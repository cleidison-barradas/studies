/* eslint-disable @typescript-eslint/no-explicit-any */
import { find } from 'lodash'
import { Connection } from 'typeorm'

class Container {
  private _providers: { [key: string]: any } = {}
  private _repositories: Record<string, any> = {}

  public resolve(token: string) {
    const matchedProvider = find(
      this._providers,
      (_provider, key) => key === token
    )

    if (matchedProvider) {
      return matchedProvider
    } else {
      throw new Error(`No provider found for ${token}!`)
    }
  }

  public setupRepositories(connection: Connection) {
    Object.keys(this._repositories).forEach(key => {
      this._providers[key] = connection.getCustomRepository(this._repositories[key])

    })
  }

  public addProvider(token: string, instance: any) {
    this._providers[token] = instance
  }

  public addRepository(repositoryName: string, provider: any) {
    this._repositories[repositoryName] = provider
  }
}

export const container = new Container()

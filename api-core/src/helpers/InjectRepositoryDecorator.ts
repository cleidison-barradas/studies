/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getCustomRepository } from 'typeorm'
import { container } from './Container'
import { Inject } from './InjectorDecorator'

export const InjectRepository = <T = any>(repository: T) => Inject(repository, setupRepository(repository))

const setupRepository = <T = any>(repository: T): any => {
  const repositoryName = (repository as any).name
  const repo = container.resolve(repositoryName)

  return getCustomRepository(repo)

  /*container.addRepository(repositoryName, repo)
  return repo*/
}

/* tslint:disable */

import { Button } from '@material-ui/core'

import { LinearProgress } from '../LinearProgress'
import { SynchronizeStockLoadingProps } from './model'

import { SynchronizeStockLoadingStyled } from './styles'

export const SynchronizeStockLoading = ({ progress, onFinish, status }: SynchronizeStockLoadingProps) => {
  const label = {
    fail: 'Sincronização falhou',
    success: 'Sincronização finalizada com sucesso!',
    loading: 'Sincronizando...',
    none: 'Sincronizando...',
  }

  return (
    <SynchronizeStockLoadingStyled>
      <LinearProgress variant={status} progress={progress} />

      <h1>{label[status]}</h1>

      {status === 'fail' && (
        <Button onClick={() => window.open('https://mypharmasupport.zendesk.com/hc/pt-br')} variant="contained" className="fail">
          Acionar suporte
        </Button>
      )}

      {status === 'success' && (
        <Button className="success" onClick={() => onFinish()}>
          Gerenciar estoque virtual
        </Button>
      )}
    </SynchronizeStockLoadingStyled>
  )
}

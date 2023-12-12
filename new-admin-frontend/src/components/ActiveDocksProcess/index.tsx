import { ReactNode } from 'react'
import { Button } from '@material-ui/core'

import { ActiveDocksProcessProps } from './model'
import { ActiveDocksProcessStyled } from './styles'

import stockSuccessActive from '../../assets/images/stockSuccessActive.svg'
import stockErrActive from '../../assets/images/stockErrActive.svg'
import stockLoadingActive from '../../assets/images/stockLoadingActive.svg'

type DocksProcess = {
  [value: string]: ReactNode
}

export const ActiveDocksProcess = ({ status: type, onSync, onRequestActive, reasons = [] }: ActiveDocksProcessProps) => {
  const isVisibleReasons = reasons.length > 0

  const docksProcess: DocksProcess = {
    error: (
      <>
        <img src={stockErrActive} alt="Erro" />

        <h1>Erro</h1>

        <p>
          Infelizmente não foi possível prosseguir com sua ativação.
          {isVisibleReasons && 'Precisa corrigir os seguintes problemas encontrados:'}
        </p>

        <ol>
            {reasons.map((reason)=> <li key={reason}>{reason}</li>)}
          </ol>

        <Button onClick={onRequestActive} className="request_after_error" variant="contained">
          Solicitar ativação novamente
        </Button>
      </>
    ),
    success: (
      <>
        <img src={stockSuccessActive} alt="Successo" />
        <h1>Sucesso</h1>
        <p> Sua ativação foi concluída com sucesso!</p>

        <Button onClick={onSync} className="success" variant="contained" color="secondary">
          Sincronizar Estoque
        </Button>
      </>
    ),
    loading: (
      <>
        <img src={stockLoadingActive} alt="Carregando" />
        <h1>Aguardando ativação</h1>
        <p>
          Nosso time está verificando tudo para ativar seu Estoque Virtual,
          <br /> isso pode levar até 2 dias úteis.
        </p>
      </>
    ),
  }

  return <ActiveDocksProcessStyled>{docksProcess[type]}</ActiveDocksProcessStyled>
}

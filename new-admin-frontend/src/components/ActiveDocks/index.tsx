import { useContext } from 'react'
import { Button, CircularProgress, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'

import { SyncDocksContext } from '../../context/SyncDocks'
import { ActiveDocksProcess } from '../ActiveDocksProcess'

import { ActiveDocksStyled } from './styles'
import { ActiveDocksProps } from './model'

import stockClient from '../../assets/images/stockClient.svg'

export const ActiveDocks = (_props: ActiveDocksProps) => {
  const {
    isClient,
    setIsClient,
    status,
    loading,
    onGetStatusVirtualDocks,
    reasons,
    checkpoint,
    setCheckpoint,
    setStep,
    setStatus,
  } = useContext(SyncDocksContext)

  const choose = (
    <>
      <img src={stockClient} alt="Client" />

      <div>
        <RadioGroup value={isClient ? 'client' : 'register'} onChange={(e) => setIsClient(e.target.value === 'client')}>
          <FormControlLabel value="register" control={<Radio />} label="Não sou cliente" />
          <FormControlLabel value="client" control={<Radio />} label="Já sou cliente" />
        </RadioGroup>
      </div>

      {isClient ? (
        <>
          <h1>Já é cliente Santa Cruz?</h1>
          <p>
            Após realizar o cadastro e ser cliente basta clicar em "Quero Estoque Virtual” e iremos enviar sua solicitação para
            nosso time de integração verificar seu cadastro.
          </p>

          <Button disabled={loading} onClick={() => onGetStatusVirtualDocks()} fullWidth variant="contained" color="primary">
            {loading ? <CircularProgress variant="indeterminate" /> : 'Quero Estoque Virtual'}
          </Button>
        </>
      ) : (
        <>
          <h1>Não é cliente Santa Cruz?</h1>
          <p>Se ainda não é cliente clicar em "Fazer cadastro” e iremos enviar sua solicitação para nosso time de integração.</p>

          <Button
            onClick={() => window.open('http://www.stcruz.com.br/Paginas/Clientes/Cadastre-se.aspx')}
            fullWidth
            variant="contained"
            color="primary"
          >
            Fazer meu cadastro
          </Button>
        </>
      )}
    </>
  )

  return (
    <ActiveDocksStyled>
      {status === 'none' ? (
        choose
      ) : (
        <ActiveDocksProcess
          onRequestActive={() => onGetStatusVirtualDocks()}
          reasons={reasons}
          onSync={() =>
            setCheckpoint({
              ...checkpoint,
              label: 'segunda',
              next: true,
              onNext: () => {
                setStep(2)
                setStatus('none')
              },
            })
          }
          status={status}
        />
      )}
    </ActiveDocksStyled>
  )
}

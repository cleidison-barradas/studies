/* tslint:disable */

import { useContext } from 'react'
import { RadioGroup, Radio, Button, FormControlLabel } from '@material-ui/core'

import { SyncDocksContext } from '../../context/SyncDocks'
import { SynchronizeStockLoading } from '../SynchronizeStockLoading'

import { SynchronizeStockStyled } from './styles'

import chooseStocks from '../../assets/images/chooseStocks.svg'
import errSyncStock from '../../assets/images/errSyncStock.svg'
import successSyncStocks from '../../assets/images/successSyncStocks.svg'
import syncStock from '../../assets/images/onSyncStock.svg'

export const SynchronizeStock = () => {
  const { synchronize, setSynchronize, progress, onSyncVirtualDocks, setOnboarded } = useContext(SyncDocksContext)

  const { stocks, value, loading, status } = synchronize

  const isEmpty = stocks.length === 0

  const logos = {
    none: syncStock,
    loading: syncStock,
    fail: errSyncStock,
    success: successSyncStocks,
  }

  return (
    <SynchronizeStockStyled>
      {value ? (
        <div className="sync">
          <img src={logos[status]} alt="Sincronizar Estoque" />

          <div>
            {loading ? (
              <SynchronizeStockLoading status={synchronize.status} progress={progress} onFinish={() => setOnboarded(true)} />
            ) : (
              <>
                <h1>Sincronizar estoque</h1>

                <Button onClick={() => onSyncVirtualDocks()} variant="contained" color="primary">
                  Sincronizar
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <img src={chooseStocks} alt="Escolher Estoque" />

          <RadioGroup
            value={isEmpty || stocks.length === 1 ? 'two' : 'one'}
            className="checkbox"
            onChange={(e) =>
              setSynchronize({ ...synchronize, stocks: e.target.value === 'one' ? ['physical', 'virtual'] : ['virtual'] })
            }
          >
            <FormControlLabel value="one" control={<Radio />} label="Utilizar os 2 estoques (indicado)" />
            <FormControlLabel value="two" disabled control={<Radio />} label="Utilizar apenas o virtual" />
          </RadioGroup>

          <div>
            <h1>Ao utilizar apenas o estoque virtual</h1>
            <p>Você não exibirá seus produtos do estoque virtual no site para os seus clientes.</p>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setSynchronize({ ...synchronize, value: true, stocks: isEmpty ? ['virtual'] : stocks })}
            >
              Selecionar e avançar
            </Button>
          </div>
        </>
      )}
    </SynchronizeStockStyled>
  )
}

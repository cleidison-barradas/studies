import { Button, Modal } from '@material-ui/core'

import { SynchronizeStockLoading } from '../SynchronizeStockLoading'

import { ModalSyncStockStyled } from './styles'
import { ModalSyncStockProps } from './model'

import errSyncStock from '../../assets/images/errSyncStock.svg'
import successSyncStocks from '../../assets/images/successSyncStocks.svg'
import syncStock from '../../assets/images/onSyncStock.svg'

export const ModalSyncStock = ({ status, loading, progress, open, onChange, onFinish, onSyncronize }: ModalSyncStockProps) => {
  const logos = {
    none: syncStock,
    loading: syncStock,
    fail: errSyncStock,
    success: successSyncStocks,
  }

  const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }

  return (
    <Modal style={style} open={open} onClose={() => onChange(false)}>
      <ModalSyncStockStyled>
        <img src={logos[status]} alt="Sincronizar Estoque" />

        <div>
          {loading ? (
            <SynchronizeStockLoading progress={progress} status={status} onFinish={() => onFinish()} />
          ) : (
            <>
              <h1>Sincronizar estoque</h1>

              <Button onClick={() => onSyncronize()} variant="contained" color="primary">
                Sincronizar
              </Button>
            </>
          )}
        </div>
      </ModalSyncStockStyled>
    </Modal>
  )
}

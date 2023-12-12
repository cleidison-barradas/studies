import { Button, Modal } from '@material-ui/core'

import { ModalToggleStockProps } from './model'
import { ModalToggleStockStyled } from './styles'

export const ModalToggleStock = ({
  open,
  onChange,
  onCancel,
  onConfirm,
  cancelAction,
  name,
  confirmAction,
  description,
  icon,
  variant,
}: ModalToggleStockProps) => {
  const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }

  return (
    <Modal style={style} open={open} onClose={() => onChange(false)}>
      <ModalToggleStockStyled variant={variant}>
        <img src={icon} alt={variant} />

        <div>
          <h4>{name}</h4>

          <p>{description}</p>

          <div>
            <Button variant="outlined" onClick={onCancel} fullWidth>
              {cancelAction}
            </Button>
            <Button variant="contained" onClick={onConfirm} fullWidth>
              {confirmAction}
            </Button>
          </div>
        </div>
      </ModalToggleStockStyled>
    </Modal>
  )
}

import React, { Component } from 'react'
import { Button, withStyles, MenuItem, FormControl } from '@material-ui/core'
import TextFormField from '../../components/TextFormField'
import SelectFormField from '../../components/SelectFormField'
import style from './styles'
import { Field } from 'formik'

type Props = {
  classes: Record<keyof ReturnType<typeof style>, string>,
  closeModal: () => void
  handleSubmit: (data: any) => void,
}

interface Types {
  type: string,
  name: string
}

type State = {
  paymentTypes: Types[]
}

class CustomDialogPaymentOptions extends Component<Props, State> {
  state: State = {
    paymentTypes: [
      {
        type: 'credit',
        name: 'Credito'
      },
      {
        type: 'debit',
        name: 'Debito'
      },
      {
        type: 'covenant',
        name: 'Convenio'
      },
      {
        type: 'money',
        name: 'Dinheiro'
      }
    ]
  }

  _renderTypes = () => {
    const { paymentTypes } = this.state
    return paymentTypes.map(p => (
      <MenuItem key={p.type}>{p.name}</MenuItem>
    ))
  }

  render() {
    const { classes, closeModal, handleSubmit } = this.props
    const { paymentTypes } = this.state

    return (
      <div className={classes.addoptionscontainer}>
        <FormControl className={classes.formcontrol1}>
          <Field
            classes={{
              root: classes.textfield,
            }}
            label="Nome"
            name="name"
            autoComplete="off"
            component={TextFormField}
          />
        </FormControl>

        <FormControl className={classes.formcontrolselect}>
          <Field
            name="type"
            label="Tipos de pagamento"
            className={classes.select}
            component={SelectFormField}
          >
            {paymentTypes.map(option => (
              <MenuItem
                key={option.type}
                value={option.type}
              >
                {option.name}
              </MenuItem>
            ))}
          </Field>
        </FormControl>

        <div className={classes.actions}>
          <Button
            type="button"
            variant="contained"
            classes={{ contained: classes.buttonconfirm }}
            onClick={handleSubmit}
          >Salvar</Button>
          <Button
            variant="contained"
            classes={{ contained: classes.buttoncancel }}
            onClick={closeModal}
          >Cancelar</Button>
        </div>
      </div>
    )
  }
}

export default withStyles(style)(CustomDialogPaymentOptions)

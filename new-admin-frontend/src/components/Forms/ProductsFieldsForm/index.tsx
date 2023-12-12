import { Chip, MenuItem, Select, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  fields: string[]
  availableFields: string[]
  removeField: (field: string) => void
  addField: (field: string) => void
}

const parseField: any = {
  category: 'Categoria',
  manufacturer: 'Fabricante',
  control: 'Controle',
  classification: 'Classificação',
  price: 'Preço',
}

class ProductsFieldsForm extends Component<Props> {
  render() {
    const { classes, fields, availableFields, removeField, addField } = this.props
    return (
      <div className={classes.tag}>
        {fields.map((value, index) => (
          <Chip key={index} label={parseField[value]} onDelete={() => removeField(value)} className={classes.tag} />
        ))}
        <Select onChange={(ev) => ev.target.value && addField(ev.target.value as string)} value={'none'}>
          <MenuItem disabled value={'none'}>
            Adicionar campos
          </MenuItem>
          {availableFields.map((value, index) =>
            fields.includes(value) ? null : (
              <MenuItem key={index} value={value as any}>
                {parseField[value]}
              </MenuItem>
            )
          )}
        </Select>
      </div>
    )
  }
}

export default withStyles(styles)(ProductsFieldsForm)

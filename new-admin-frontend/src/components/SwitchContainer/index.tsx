import { Typography, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import { FieldProps } from 'formik'
import React, { Component } from 'react'
import SwitchFormField from '../SwitchFormField'
import styles from './styles'

interface Props extends FieldProps {
  classes: any
  disabled?: boolean
  statusText: string
}

class SwitchContainer extends Component<Props> {
  render() {
    const { classes, statusText, ...props } = this.props
    return (
      <div className={classNames(classes.statuscontainer, classes[`status${props.field && props.field.value ? 'true' : 'false' }`])}>
        <Typography className={classes.statustext} noWrap>
          {statusText}
        </Typography>
        <SwitchFormField {...props} />
      </div>
    )
  }
}

export default withStyles(styles)(SwitchContainer)

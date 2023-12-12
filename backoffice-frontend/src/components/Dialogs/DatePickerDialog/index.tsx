import React, { Component } from 'react'
import { DateRange, DateRangePicker } from 'materialui-daterange-picker'
import { Button, Dialog, DialogActions, DialogContent, withStyles } from '@material-ui/core'
import styles from './styles'

interface Props {
    open: boolean
    toggle: () => void
    clear: () => void
    onChange: (dateRange: DateRange) => void
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class DatePickerDialog extends Component<Props> {
    render() {
        const { open, toggle, onChange, classes, clear } = this.props
        return (
            <Dialog open={open} maxWidth="md" fullWidth>
                <DialogContent>
                    <DateRangePicker
                        open={true}
                        toggle={toggle}
                        wrapperClassName={classes.container}
                        onChange={onChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={clear}>
                        Limpar
                    </Button>
                    <Button color="primary" variant="contained" onClick={toggle}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(DatePickerDialog)

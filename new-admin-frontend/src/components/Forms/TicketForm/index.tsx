import { Box, Grid, Link, withStyles } from '@material-ui/core'
import { Field } from 'formik'
import React, { Component } from 'react'
import TextFormField from '../../TextFormField'
import styles from './styles'



interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class TicketForm extends Component<Props> {
    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <Box mt={2}>
                    <Grid container spacing={3}>
                        <Grid item lg={4} md={6} sm={12} xs={12} xl={4}>
                            <Field
                                label="Secret Key"
                                name="extras.0"
                                className={classes.textfield}
                                variant="outlined"
                                component={TextFormField}
                                fullWidth
                            />
                        </Grid>
                        <Grid item lg={4} md={6} sm={12} xs={12} xl={4}>
                            <Field
                                label="Public Key"
                                name="extras.1"
                                className={classes.textfield}
                                variant="outlined"
                                fullWidth
                                component={TextFormField}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <Link
                            href={`https://mypharmasupport.zendesk.com/hc/pt-br/search?utf8=%E2%9C%93&query=${'integrar com boleto'.replaceAll(
                                ' ',
                                '+'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Saber mais sobre como integrar o boleto
                        </Link>
                    </Box>
                </Box>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(TicketForm)

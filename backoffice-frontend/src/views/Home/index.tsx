import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './styles'

type HomeProps = {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class Home extends Component<HomeProps> {
    render() {
        return  <React.Fragment />
    }
}

export default withStyles(styles)(Home)

import { Box, Breadcrumbs as MuiBreadCrumbs, Link, withStyles } from '@material-ui/core'
import { NavigateNext } from '@material-ui/icons'
import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppRoute } from '../../navigation'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    crumbs: AppRoute[]
}

class Breadcrumbs extends Component<Props> {
  render () {
    const { crumbs = [] } = this.props
    if (crumbs.length <= 1) {
      return null
    }
    return (
            <Box mb={2}>
                <MuiBreadCrumbs separator={<NavigateNext />}>
                    {/* Link back to any previous steps of the breadcrumb. */}
                    {crumbs.map(({ name, path }: AppRoute, key: number) =>
                      key + 1 === crumbs.length
                        ? (
                            <span key={key} color="inherit">
                                {name}
                            </span>
                          )
                        : (
                            <Link color="inherit" key={key} to={path} component={RouterLink}>
                                {name}
                            </Link>
                          )
                    )}
                </MuiBreadCrumbs>
            </Box>
    )
  }
}

export default withStyles(styles)(Breadcrumbs)

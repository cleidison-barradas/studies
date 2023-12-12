import React, { Component } from 'react'
import { Box, Typography, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'
import { FileCopyOutlined } from '@material-ui/icons'

type LinkProps = {
  classes: any
  link: string
}

class LinkCell extends Component<LinkProps> {
  copyLinkToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
  }

  render() {
    const { link, classes } = this.props
    return (
      <Box className={classes.boxContent}>
        <Typography variant="body2" color="primary">
          {link}
        </Typography>
        <Button onClick={() => this.copyLinkToClipboard(link)}>
          <FileCopyOutlined color="primary" />
        </Button>
      </Box>
    )
  }
}

export default withStyles(styles)(LinkCell)

import { Box, Button, MenuItem, MenuList, Popover, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './styles'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { AuthConsumer } from '../../context/AuthContext'
import BlueUserIcon from '../../assets/images/icons/header/blueUserIcon.svg'
import WhiteUserIcon from '../../assets/images/icons/header/whiteUser.svg'
import { ThemeConsumer } from '../../context/ThemeContext'

type Props = {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

type State = {
    open: boolean
}

class UserMenu extends Component<Props, State> {
    private anchorRef: React.RefObject<HTMLButtonElement>
    constructor (props: any) {
      super(props)

      this.state = {
        open: false
      }

      this.anchorRef = React.createRef()
      this.handleToggle = this.handleToggle.bind(this)
      this.handleClose = this.handleClose.bind(this)
    }

    handleToggle () {
      this.setState({
        ...this.state,
        open: !this.state.open
      })
    }

    handleClose () {
      this.setState({
        ...this.state,
        open: false
      })
    }

    render () {
      const { classes } = this.props
      const { open } = this.state

      return (
            <ThemeConsumer>
                {({ mode }) => (
                    <AuthConsumer>
                        {({ logout }) => (
                            <>
                                <Button style={{ marginLeft: 10 }} ref={this.anchorRef} onClick={this.handleToggle}>
                                    <img height={30} src={mode === 'light' ? BlueUserIcon : WhiteUserIcon} alt="" />
                                </Button>
                                <Popover
                                    open={open}
                                    anchorEl={this.anchorRef.current}
                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                    onClose={this.handleClose}
                                    aria-haspopup="true"
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'left'
                                    }}
                                    transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'left'
                                    }}
                                    getContentAnchorEl={null}
                                    disablePortal
                                    role={undefined}
                                    PaperProps={{
                                      classes: {
                                        root: classes.paperroot
                                      }
                                    }}
                                >
                                    <MenuList>
                                        <MenuItem button onClick={logout}>
                                            <Box mr={1}>
                                                <ArrowBackIcon className={classes.dangertext} />
                                            </Box>
                                            <Typography className={classes.dangertext}>Sair</Typography>
                                        </MenuItem>
                                    </MenuList>
                                </Popover>
                            </>
                        )}
                    </AuthConsumer>
                )}
            </ThemeConsumer>
      )
    }
}

export default withStyles(styles)(UserMenu)

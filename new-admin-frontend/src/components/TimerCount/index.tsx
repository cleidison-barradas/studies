import React, { Component } from 'react'
import { Box, withStyles } from '@material-ui/core'
import style from './style'

type Props = {
  classes: any
  time: Date
}

type State = {
  time: Date
}

class TimerCount extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      time: new Date(this.props.time.getTime() - new Date().getTime()),
    }
  }

  componentDidMount() {
    const timeStart = this.props.time

    setInterval(() => {
      const timeNow = new Date()
      const timeDiff = timeStart.getTime() - timeNow.getTime()
      this.setState({ time: new Date(timeDiff) })
    }, 1000)
  }

  render() {
    const { time } = this.state
    return (
      <Box>
        {time.getHours()} : {time.getMinutes()} : {time.getSeconds()}
      </Box>
    )
  }
}

export default withStyles(style)(TimerCount)

import { Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { ReactComponent as ArrowUp } from '../../../../assets/images/arrowUp.svg'
import { ResponsiveContainer, ScatterChart, CartesianGrid, CartesianAxis, XAxis, YAxis, Scatter, Tooltip } from 'recharts'
import style from './styles'
import moment from 'moment'

type Props = {
  classes: any
}

type State = {
  email: any[]
  selected: 1
}

const CustomToolTip = (props: any) => {
  const { active, payload } = props

  if (active) {
    return (
      <div
        style={{
          width: 237,
          height: 120,
          borderRadius: 20,
          background: 'white',
          boxShadow: '5px 25px 30px 5px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          padding: 20,
        }}
      >
        <p
          style={{
            color: '#0A3463',
            fontSize: 12,
            width: '100%',
          }}
        >
          {moment().format('ddd') + payload[0].payload.x + moment().format('MMM')}
        </p>

        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              color: 'black',
              fontSize: 14,
            }}
          >
            Envios: <b>{payload[0].payload.y}</b>
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <p
              style={{
                color: false ? '#00BF91' : '#E72222',
                marginLeft: 10,
                fontSize: 14,
                marginTop: 5,
              }}
            >
              0
            </p>
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

class Chart extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      email: [],
      selected: 1,
    }
  }
  render() {
    const { classes } = this.props
    const { email } = this.state
    return (
      <>
        <Grid container spacing={3}>
          <Grid item>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Typography className={classes.value} color="primary">
                  0
                </Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <ArrowUp />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <ResponsiveContainer height={200}>
          <ScatterChart>
            <CartesianGrid vertical={false} strokeDasharray={'4 4'} />
            <CartesianAxis />
            <XAxis dataKey="x" type="number" domain={[1 , 'dataMax']} />
            <YAxis axisLine={true} tickSize={1} tick={{ stroke: 'none' }} dataKey="y" hide={true} />
            <Tooltip content={<CustomToolTip />} />
            <Scatter data={email} dataKey={'y'} fillOpacity="1" fill={'#1999F9'} line />
          </ScatterChart>
        </ResponsiveContainer>
      </>
    )
  }
}

export default withStyles(style)(Chart)

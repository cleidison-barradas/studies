import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import 'moment/locale/pt-br'
import { Component } from 'react'
import { CartesianAxis, CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import styles from './styles'

moment.locale('pt-br')

const CustomToolTip = (props: any) => {
  const { active, payload, data = [] } = props
  if (active) {
    let percentage = 0
    const date = payload[0].value
    const index = data.findIndex((value: any) => value[0] === date)
    if (index !== 0) {
      const initial = data[index - 1][1] !== '0' ? data[index - 1][1] : 1
      const final = data[index][1] !== '0' ? data[index][1] : 1
      percentage = (Number(final) / Number(initial) - 1) * 100
    }
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
          {moment(payload[0].value, 'YYYYMMDD').format('dddd,DD MMMM YYYY')}
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
            Usuários: <b>{payload[1].value}</b>
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <img
              src={require(`../../../../assets/images/${percentage > 0 ? 'arrowUp.svg' : 'arrowDown.svg'}`).default}
              alt="arrow"
            />
            <p
              style={{
                color: false ? '#00BF91' : '#E72222',
                marginLeft: 10,
                fontSize: 14,
                marginTop: 5,
              }}
            >
              {' '}
              {Math.floor(Math.abs(percentage))} %{' '}
            </p>
          </div>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

type Props = {
  classes: any
  data: any
}

class Chart extends Component<Props> {
  formatData(data: any[]) {
    const formatted = data.map((value: any) => {
      return {
        x: value[0],
        y: value[1],
      }
    })

    formatted.sort((a, b) => a.x - b.x)

    return formatted
  }

  getMaxY(data: any[]) {
    const max = [...data].sort((a, b) => (Number(a[1]) > Number(b[1]) ? 1 : -1))
    if (max.length > 0) return Number(max[max.length - 1][1])
    return 0
  }

  render() {
    const { data = [] } = this.props
    return (
      <ResponsiveContainer>
        <ScatterChart width={200} height={250}>
          <CartesianGrid vertical={false} strokeDasharray={'4 4'} />
          <CartesianAxis />
          <XAxis stroke={'white'} dataKey={'x'} tickFormatter={(value: any) => moment(value, 'YYYYMMDD').format('DD/MM')} />
          <YAxis
            axisLine={true}
            tickSize={1}
            dataKey={'y'}
            domain={[0, this.getMaxY(data)]}
            tick={{ stroke: 'none' }}
            hide={true}
          />
          <Tooltip cursor={{ strokeDasharray: '0 0' }} content={<CustomToolTip data={data} />} />
          <Scatter
            data={this.formatData(data)}
            fillOpacity="1"
            fill={'#F5DE58'}
            line
            shape="circle"
            onClick={(e) => console.log(e)}
          />
        </ScatterChart>
      </ResponsiveContainer>
    )
  }
}

export default withStyles(styles)(Chart)

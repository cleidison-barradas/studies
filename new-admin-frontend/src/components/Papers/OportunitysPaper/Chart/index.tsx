import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'

import { PieChart, Pie, Sector, Cell } from 'recharts'

type Props = {
  classes: any
  data: any
}

const colors = ['#1999F9', '#00BF91']

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props
  return (
    <g>
      <text
        x={window.innerWidth > 600 ? cx * 2 + 50 : cx * 2 - 10}
        y={cy - 40}
        dy={8}
        fontSize={15}
        fontWeight={'bold'}
        textAnchor="right"
        fill={'#00000'}
      >{`${payload.name}`}</text>
      <text x={window.innerWidth > 600 ? cx * 2 + 135 : cx * 2 + 75} y={cy - 40} dy={8} fontSize={15} textAnchor="right">
        ({payload.value} cliques)
      </text>
      <text x={cx * 2 + 50} y={cy - 40 + 40} dy={8} textAnchor="right" fill={'#72C2FF'}>{` ${(percent * 100).toFixed(2)}%`}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  )
}

renderActiveShape.propTypes = {
  cx: Number,
  cy: Number,
  midAngle: Number,
  innerRadius: Number,
  outerRadius: Number,
  startAngle: Number,
  endAngle: Number,
  fill: String,
  payload: String,
  percent: Number,
  value: Number,
}

renderActiveShape.defaultProps = {
  cx: 0,
  cy: 0,
  midAngle: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  fill: '#eee',
  payload: '',
  percent: 0,
  value: 0,
}

class Chart extends Component<Props> {
  state = {
    activeIndex: 0,
  }

  onPieEnter(evt: any) {
    const index = this.props.data.findIndex((p: any) => p.name === evt.name)
    this.setState({
      activeIndex: index,
    })
  }

  render() {
    const { activeIndex } = this.state
    const { data } = this.props

    return (
      <PieChart
        height={120}
        width={350}
        margin={{
          top: 15,
          right: 225,
          left: 0,
          bottom: 15,
        }}
      >
        <Pie
          dataKey="value"
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          innerRadius={20}
          outerRadius={50}
          dx={0}
          dy={0}
          fillOpacity="1"
          onMouseEnter={(event) => this.onPieEnter(event)}
        >
          {data.map((value: any, index: any) => (
            <Cell fill={colors[index]} key={index} />
          ))}
        </Pie>
      </PieChart>
    )
  }
}

export default withStyles(styles)(Chart)

import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'
import PaperBlock from '../PaperBlock'
import Slider from 'react-slick'
import { Box, Paper, Typography } from '@material-ui/core'
import billboardContext from '../../context/BillboardContext'
import IBillboard from '../../interfaces/billboard'
import { ThemeConsumer } from '../../context/ThemeContext'
import { InfoOutlined } from '@material-ui/icons'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import WarningIcon from '@material-ui/icons/Warning'

type Props = {
  classes: any
}

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'transparent', color: '#000000', right: '-35px' }}
      onClick={onClick}
    />
  )
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'transparent', color: '#000000', left: '-35px' }}
      onClick={onClick}
    />
  )
}

const typeToIcon: any = {
  info: <InfoOutlined />,
  danger: <ErrorOutlineIcon />,
  warning: <WarningIcon />,
}

const typeToColor: any = {
  info: '#2196F3',
  danger: '#E72222',
  warning: '#E58D57',
}

class ScrapsAndWarnings extends Component<Props> {
  static contextType = billboardContext
  context!: React.ContextType<typeof billboardContext>

  async componentDidMount() {
    const { getBillboard } = this.context
    await getBillboard()
  }

  render() {
    const { classes } = this.props
    const { billboard } = this.context

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: <SamplePrevArrow />,
      nextArrow: <SampleNextArrow />,
      swipeToSlide: true,
    }

    return (
      <ThemeConsumer>
        {({ mode }) => (
          <PaperBlock
            title={'Recados e Avisos'}
            backgroundColor={mode === 'light' ? ['yellow', 'primary', 'light'] : ['yellow', 'primary', 'dark']}
            borderColor={mode === 'light' ? ['black', 'primary', 'light'] : ['black', 'primary', 'dark']}
          >
            <Box p={3} height={'100%'}>
              {billboard.length ? (
                <Slider {...settings} className={classes.carousel}>
                  {billboard.map((value: IBillboard, index) => (
                    <Paper elevation={0} className={classes.item} key={index}>
                      <div style={{ color: typeToColor[value.type] }} className={classes.itemTitle}>
                        {typeToIcon[value.type]}
                        <Typography color="inherit" className={classes.title}>
                          {value.title}
                        </Typography>
                      </div>
                      <div className={classes.description} dangerouslySetInnerHTML={{ __html: value.message }} />
                    </Paper>
                  ))}
                </Slider>
              ) : (
                <div className={classes.emptyContainer}>
                  <img src={require('../../assets/images/blueFlag.svg').default} alt="" />
                  <p>Sem avisos</p>
                </div>
              )}
            </Box>
          </PaperBlock>
        )}
      </ThemeConsumer>
    )
  }
}

export default withStyles(styles)(ScrapsAndWarnings)

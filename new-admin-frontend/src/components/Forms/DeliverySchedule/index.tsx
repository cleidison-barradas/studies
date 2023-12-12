/* eslint-disabled no-shadowed-variable*/
import { Button, IconButton, Typography, withStyles, CircularProgress, Box, TextField } from '@material-ui/core'

import classNames from 'classnames'
import React from 'react'
import CustomDaysSelect from '../../CustomDaysSelect'
import CustomTimePicker from '../../CustomTimePicker'
import PaperBlock from '../../PaperBlock'

import { ClearRounded } from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import moment from 'moment'
import { startOfHour, isValid } from 'date-fns'
import CustomButton from '../../CustomButton'
import ScheduleInterface from '../../../interfaces/deliverySchedule'

import style from './style'
import SuportLink from '../../SuportLink'
import CustomComponent from '../../CustomComponent'

type Props = {
  mode: any
  error: any
  classes: any
  deletedId?: any
  titleName: string
  averageTime?: boolean
  fetching: boolean
  loadSchedule: () => Promise<any>
  onSave: (data: any) => Promise<void>
  onDelete: (data: any) => void
}

type LoadOptions = {
  isDelete?: boolean
}

type State = {
  loading: boolean
  saveError: string | null
  initialState: any
  data: {
    averageDeliveryTime?: number
    schedule: ScheduleInterface[]
  }
  canSave: boolean
  saveLoading: boolean
  error: any
  deleting: boolean
}

class DeliverySchedule extends CustomComponent<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      initialState: {},
      data: {
        averageDeliveryTime: 0,
        schedule: [],
      },
      loading: true,
      saveLoading: false,
      saveError: null,
      error: null,
      canSave: false,
      deleting: false,
    }
  }

  onLoad = async (args?: LoadOptions) => {
    const { loadSchedule } = this.props
    const { schedule, averageDeliveryTime } = await loadSchedule()

    this.setState(
      (state: any) => ({
        ...state,
        loading: false,
        data: {
          schedule,
          averageDeliveryTime: args?.isDelete ? state.data.averageDeliveryTime : averageDeliveryTime,
        },
      }),
      () => {
        this.setState((state) => ({
          ...state,
          initialState: { ...state.data },
        }))
      }
    )
  }

  componentDidMount() {
    this.onLoad()
  }
  UNSAFE_componentWillReceiveProps(newProps: any) {
    const { error, fetching, schedule, deletedId } = newProps
    const { saveLoading, deleting } = this.state

    if (error) {
      this.setState({
        loading: false,
        error,
        saveLoading: false,
        deleting: false,
      })
    }

    if (saveLoading && !error && !fetching && schedule && schedule.length > 0) {
      this.setState({
        saveLoading: false,
        loading: false,
        data: {
          ...this.state.data,
          schedule,
        },
      })
    }

    if (deleting && !fetching && !error && deletedId) {
      this.setState({
        loading: false,
        deleting: false,
      })
    }
  }

  validate() {
    const { data } = this.state
    const { schedule } = data
    let messageEmpty = null

    const findWeekDayEmpty = schedule.filter((s) => s.weekDay === '').length > 0

    if (findWeekDayEmpty) {
      messageEmpty = 'Todos os campos devem ser prenchidos (hora e dia da semana).'
    }

    this.setState({
      canSave: findWeekDayEmpty,
      saveError: messageEmpty,
    })
  }
  setWeekDays(times: any) {
    const newState = this.state
    newState.data.schedule = times

    this.setState({
      data: {
        ...newState.data,
        schedule: times,
      },
    })
  }

  onChangeDay(weekDay: any, index: any) {
    const { data } = this.state
    const { schedule } = data
    const { value } = weekDay.target
    const changeWeekDay = schedule

    const existsWeekDay = schedule.filter((s) => s.weekDay === value).length > 0

    if (!existsWeekDay) {
      changeWeekDay[index].weekDay = value

      this.setState(
        {
          saveError: null,
        },
        () => {
          this.setWeekDays(changeWeekDay)
        }
      )
    } else {
      changeWeekDay[index].weekDay = ''
      this.setState((state) => ({
        ...state,
        saveError: 'Opção já selecionada.',
      }))
    }
  }

  onChangeTime(date: any, index: any, type: any, interval?: boolean) {
    const isValidate = isValid(date)
    const { data } = this.state
    const { schedule } = data

    if (isValidate) {
      const time = schedule

      if (interval) {
        if (type === 0) {
          time[index].interval.intervalStart = date
        } else {
          time[index].interval.intervalEnd = date
        }
      } else {
        if (type === 0) {
          time[index].start = date
        } else {
          time[index].end = date
        }
      }

      this.setState(
        {
          saveError: null,
        },
        () => {
          this.setWeekDays(time)
        }
      )
    }
  }

  newTime() {
    const { data } = this.state
    const { schedule } = data
    const now = moment.now()
    const start = startOfHour(now)
    const end = startOfHour(now)
    this.validate()

    const newSchedule = schedule

    newSchedule.push({
      weekDay: '',
      start,
      end,
      interval: {
        active: false,
      },
    })
    this.setState(
      (state) => ({
        ...state,
        saveError: null,
      }),
      () => {
        this.setWeekDays(newSchedule)
      }
    )
  }

  removeTime(index: any, id?: any) {
    const { data } = this.state
    const { onDelete } = this.props
    const { schedule } = data
    const remove = schedule

    if (id) {
      this.setState(
        {
          loading: true,
          saveError: null,
          deleting: true,
        },
        () => {
          onDelete(id)
          remove.splice(index, 1)
          this.setWeekDays(remove)
        }
      )
    } else {
      remove.splice(index, 1)
      this.setWeekDays(remove)
    }

    setTimeout(() => {
      this.onLoad({ isDelete: true })
    }, 1500)
  }

  addAfterBreak(index: any) {
    const { data } = this.state
    const { schedule } = data
    const now = moment.now()
    const start = startOfHour(now)
    const end = startOfHour(now)

    const interval = schedule

    interval[index].interval = {
      active: true,
      intervalStart: start,
      intervalEnd: end,
    }
    this.setState(
      {
        saveError: null,
      },
      () => {
        this.setWeekDays(interval)
      }
    )
  }

  removeAfterBreak(index: any) {
    const { data } = this.state
    const { schedule } = data
    const removeInterval = schedule

    removeInterval[index] = {
      _id: removeInterval[index]._id,
      weekDay: removeInterval[index].weekDay,
      start: removeInterval[index].start,
      end: removeInterval[index].end,
      interval: {
        active: false,
      },
    }

    this.setState(
      {
        saveError: null,
      },
      () => {
        this.setWeekDays(removeInterval)
      }
    )
  }

  processSubmit() {
    this.validate()
    this.handleSubmit()
  }

  onChangeAverageTimeValue(value: string) {
    this.setState(({ data, ...state }) => ({
      ...state,
      data: { ...data, averageDeliveryTime: parseInt(value, 10) },
    }))
  }

  handleSubmit() {
    const { onSave } = this.props
    const { data, canSave } = this.state

    if (!canSave) {
      this.setState(
        (state) => ({
          ...state,
          saveLoading: true,
          saveError: null,
          error: null,
          loading: true,
        }),
        async () => {
          await onSave(data)
          this.onLoad()
        }
      )
    }
  }

  _renderListSchedule = () => {
    const { classes } = this.props
    const { data } = this.state
    const { schedule: schedules } = data

    if (schedules.length > 0) {
      return schedules.map((schedule: any, index: any) => (
        <React.Fragment key={index}>
          <div className={classes.header}>
            <CustomDaysSelect selectValue={schedule.weekDay} onChange={(e: any) => this.onChangeDay(e, index)} />
            <IconButton className={classes.trash} onClick={() => this.removeTime(index, schedule._id)}>
              <DeleteIcon style={{ fill: '93A0AC' }} />
            </IconButton>
          </div>
          <Box className={classes.row} display="flex" alignItems="center" flexWrap="wrap">
            <div className={classes.row}>
              <Box display="flex" alignItems="center" minWidth="300px">
                <Typography className={classes.text}> das </Typography>
                <CustomTimePicker
                  onChange={(props: any) => this.onChangeTime(props, index, 0)}
                  value={schedule.start}
                  customClass={classNames(classes.time, !schedule.start ? classes.empty : '')}
                />

                <Typography className={classes.dashed}> às - </Typography>

                <CustomTimePicker
                  onChange={(props: any) => this.onChangeTime(props, index, 1)}
                  value={schedule.end}
                  customClass={classNames(classes.time, !schedule.end ? classes.empty : '')}
                />
              </Box>

              {schedule.interval.active ? (
                <Box className="afterBreak" display="flex" alignItems="center" flexWrap="wrap">
                  <Box display="flex" alignItems="center" minWidth="300px">
                    <Typography className={classNames(classes.text, classes.afterBreak)}>
                      {window.innerWidth > 600 ? 'E das' : 'das'}
                    </Typography>

                    <CustomTimePicker
                      onChange={(props: any) => this.onChangeTime(props, index, 0, true)}
                      value={schedule.interval.intervalStart}
                      customClass={classNames(classes.time, !schedule.interval.intervalStart ? classes.empty : '')}
                    />

                    <Typography className={classes.dashed}> às - </Typography>

                    <CustomTimePicker
                      onChange={(props: any) => this.onChangeTime(props, index, 1, true)}
                      value={schedule.interval.intervalEnd}
                      customClass={classNames(classes.time, !schedule.interval.intervalEnd ? classes.empty : '')}
                    />
                  </Box>

                  <Button className={classes.button} onClick={() => this.removeAfterBreak(index)}>
                    Retirar pós intervalo
                    <ClearRounded />
                  </Button>
                </Box>
              ) : (
                <Button className={classes.button} onClick={() => this.addAfterBreak(index)}>
                  Adicionar pós intervalo
                  <ClearRounded />
                </Button>
              )}
            </div>
          </Box>
        </React.Fragment>
      ))
    }
  }

  render() {
    const { classes, titleName, averageTime } = this.props
    const {
      loading,
      saveError,
      data: { averageDeliveryTime },
    } = this.state

    return (
      <div>
        <PaperBlock title={titleName}>
          {
            <React.Fragment>
              {loading ? (
                <div className={classes.fetchingcontainer}>
                  <CircularProgress size={60} color="primary" />
                </div>
              ) : (
                <React.Fragment>
                  {averageTime ? (
                    <Box className={classes.averageTime}>
                      <TextField
                        type="number"
                        value={averageDeliveryTime}
                        onChange={(e) => this.onChangeAverageTimeValue(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        placeholder="Minutos"
                        label="Tempo médio de entrega"
                      />
                    </Box>
                  ) : (
                    this._renderListSchedule()
                  )}

                  {saveError ? <Typography className={classes.error}>{saveError}</Typography> : null}

                  {!averageTime && (
                    <Button
                      color="primary"
                      style={{ fontWeight: 'normal', marginLeft: '15px', marginBottom: '5px' }}
                      onClick={() => this.newTime()}
                    >
                      ADICIONAR
                    </Button>
                  )}
                  <CustomButton
                    buttonClassName={classes.saveButton}
                    buttonText="SALVAR"
                    click={() => this.processSubmit()}
                    loading={false}
                    disabled={false}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          }
          <SuportLink query="programacao de entrega" />
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(style)(DeliverySchedule)

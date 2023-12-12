/*  tslint:disable no-shadowed-variable */
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ShowcaseConsumer } from '../../../context/ShowcaseContext'
import Showcase from '../../../interfaces/showcase'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import styles from './styles'
import { StoreConsumer } from '../../../context/StoreContext'
import { HelpOutline } from '@material-ui/icons'
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import _ from 'lodash'

interface Props extends RouteComponentProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
  showcases: Showcase[]
  updateShowcases: (showcases: Showcase[]) => Promise<void>
  isFetching?: boolean
}

interface State {
  showcases: Showcase[]
}

class ShowcaseTable extends Component<Props, State> {
  state: State = {
    showcases: [],
  }

  componentDidUpdate() {
    if (this.state.showcases.length === 0 && this.props.showcases.length > 0) {
      this.setState({
        ...this.state,
        showcases: this.props.showcases,
      })
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.isArrayEqual(nextProps.showcases, this.state.showcases) && !nextProps.isFetching) {
      this.setState({
        ...this.state,
        showcases: nextProps.showcases,
      })
    }
  }

  isArrayEqual = (x: any[], y: any[]) => {
    return _(x).xorWith(y, _.isEqual).isEmpty()
  }

  onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { showcases } = this.state

    if (!result.destination) return

    const items = Array.from(showcases)

    const [removed] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, removed)

    const values = items.map((value, index) => ({
      ...value,
      position: index,
    }))

    this.setState({
      ...this.state,
      showcases: values,
    })
  }

  onSave = async () => {
    const { showcases } = this.state
    const { updateShowcases } = this.props

    await updateShowcases(showcases)
  }

  render() {
    const { classes, history } = this.props
    const { showcases } = this.state

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <ShowcaseConsumer>
          {({ updateShowcases, deleteShowcase, getShowcases, postShowcase, fetching }) => (
            <React.Fragment>
              <TableContainer>
                <StoreConsumer>
                  {({ store }) => (
                    <Table
                      classes={{
                        root: classes.table,
                      }}
                    >
                      <TableHead>
                        <TableRow
                          classes={{
                            root: classes.tablerow,
                          }}
                        >
                          <TableCell
                            classes={{
                              root: classes.tablecell,
                            }}
                          >
                            Nome
                          </TableCell>
                          <TableCell
                            classes={{
                              root: classes.tablecell,
                            }}
                          >
                            {store?.settings?.config_new_layout ? (
                              <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                                Status
                                <Tooltip title="Vitrines despublicadas não aparecem no site">
                                  <HelpOutline />
                                </Tooltip>
                              </Box>
                            ) : (
                              'Principal'
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            classes={{
                              root: classes.tablecell,
                            }}
                          >
                            Editar
                          </TableCell>
                          <TableCell
                            align="right"
                            classes={{
                              root: classes.tablecell,
                            }}
                          >
                            Excluir
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <Droppable direction="vertical" droppableId="showcase">
                        {(provided) => (
                          <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                            {showcases
                              .sort((first, second) => {
                                if (!first.position) return -1
                                if (!second.position) return 1
                                if (first.position < second.position) {
                                  return -1
                                } else if (first.position > second.position!) {
                                  return 1
                                } else {
                                  return 0
                                }
                              })
                              .map(({ _id, name, main, status }: Showcase, index: any) => {
                                return (
                                  <Draggable key={_id} draggableId={_id!} index={index}>
                                    {(provider, snapshot) => (
                                      <TableRow
                                        classes={{
                                          root: classes.tablerow,
                                        }}
                                        style={{
                                          display: snapshot.isDragging ? 'table' : 'block',
                                        }}
                                        ref={provider.innerRef}
                                        {...provider.draggableProps}
                                        {...provider.dragHandleProps}
                                      >
                                        <TableCell
                                          classes={{
                                            root: classes.tablecell,
                                          }}
                                        >
                                          <Typography>{name}</Typography>
                                        </TableCell>
                                        <TableCell
                                          classes={{
                                            root: classes.tablecell,
                                          }}
                                        >
                                          {store?.settings?.config_new_layout ? (
                                            <FormControl>
                                              <FormControlLabel
                                                label={
                                                  <Box display="flex" alignItems="center" style={{ gap: 8 }}>
                                                    {status === true ? 'Publicada' : 'Despublicada'}
                                                  </Box>
                                                }
                                                labelPlacement={'end'}
                                                control={
                                                  <Switch
                                                    checked={status}
                                                    onChange={async (e, value) => {
                                                      await postShowcase({ _id, status: value })
                                                      await getShowcases()
                                                    }}
                                                    color="default"
                                                  />
                                                }
                                              />
                                            </FormControl>
                                          ) : main ? (
                                            <Chip label="Principal" color="primary" />
                                          ) : (
                                            <Button
                                              onClick={async () => {
                                                await postShowcase({ _id, main: true })
                                                await getShowcases()
                                              }}
                                            >
                                              Tornar principal
                                            </Button>
                                          )}
                                        </TableCell>
                                        <TableCell
                                          align="right"
                                          classes={{
                                            root: classes.tablecell,
                                          }}
                                        >
                                          <IconButton onClick={() => history.push(`/showcase/edit/${_id}`)}>
                                            <EditIcon />
                                          </IconButton>
                                        </TableCell>
                                        <TableCell
                                          align="right"
                                          classes={{
                                            root: classes.tablecell,
                                          }}
                                        >
                                          <IconButton
                                            onClick={async () => {
                                              await deleteShowcase(_id)
                                              await getShowcases()
                                            }}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </Draggable>
                                )
                              })}
                            {provided.placeholder}
                          </TableBody>
                        )}
                      </Droppable>
                    </Table>
                  )}
                </StoreConsumer>
              </TableContainer>
              <Box mt={3}>
                <Button onClick={this.onSave} disabled={fetching} variant="contained" color="primary">
                  Salvar
                </Button>
              </Box>
            </React.Fragment>
          )}
        </ShowcaseConsumer>
      </DragDropContext>
    )
  }
}

export default withStyles(styles)(withRouter(ShowcaseTable))

import React, { Component } from 'react'
import classNames from 'classnames'
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    withStyles,
    Chip,
    CircularProgress,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete'
import NumberFormat from 'react-number-format'

import StateInterface from '../../../interfaces/state'
import CityInterface from '../../../interfaces/city'
import { Neighborhood as NeighborhoodInterface } from '../../../interfaces/neighborhood'
import { FormConsumer, FormProvider } from '../../../context/FormContext'
import Formized from '../../../components/Formized'
import style from './style'

type Props = {
    classes: any
    fetching: boolean
    states: StateInterface[]
    cities: CityInterface[]
    neighborhoods: NeighborhoodInterface[]
    neighborhood: NeighborhoodInterface | null
    getStates: () => void
    getCities: () => void
    getNeighborhoods: () => void
    addNeighborhood: (name: string, city: string) => Promise<any>
    handleSave: (data: any) => void
}

type State = {
    inputs: {
        feePrice: number
        freeFrom: number
        minimumPurchase: number
        deliveryTime: number
        neighborhoods: any
    }
    errorSave: any
    loading: boolean
    checked: boolean
    disabled: boolean
    addingNeighborhood: boolean
    cities: CityInterface[]
    cityId: CityInterface['_id']
    stateId: StateInterface['_id']
    neighborhoods: NeighborhoodInterface[]
    neighborhoodSelected: NeighborhoodInterface[]
    neighborhoodIds: NeighborhoodInterface['_id']
}

class NewDeliveryPolitics extends Component<Props, State> {
    static defaultProps = {
        fetching: false,
        states: [],
        cities: [],
        neighborhoods: [],
        neighborhood: null,
    }

    constructor(props: any) {
        super(props)

        this.state = {
            inputs: {
                feePrice: 0,
                freeFrom: 0,
                minimumPurchase: 0,
                deliveryTime: 0,
                neighborhoods: undefined,
            },
            neighborhoods: [],
            cities: [],
            stateId: undefined,
            cityId: undefined,
            neighborhoodIds: undefined,
            neighborhoodSelected: [],
            loading: false,
            checked: false,
            disabled: false,
            errorSave: null,
            addingNeighborhood: false,
        }
    }

    onLoad = () => {
        const { getStates, getCities, getNeighborhoods } = this.props
        getStates()
        getCities()
        getNeighborhoods()
    }

    componentDidMount() {
        this.onLoad()
    }

    UNSAFE_componentWillReceiveProps(newProps: any) {
        const { neighborhood, fetching } = newProps
        const { addingNeighborhood } = this.state

        if (addingNeighborhood && !fetching && neighborhood !== null) {
            this.setState((state) => ({
                ...state,
                addingNeighborhood: false,
                neighborhoodSelected: Array(neighborhood),
                inputs: {
                    ...state.inputs,
                    neighborhoods: Array(neighborhood).map((n) => n._id),
                },
            }))
        }
    }

    handleSelectAllNeigborhoods = ({ target: { name, checked } }: any) => {
        const { cityId, stateId, neighborhoods, neighborhoodSelected } = this.state

        const neighborhoodsSelecteds = neighborhoodSelected.filter((neighborhood) => neighborhood.city._id === cityId).length

        if (cityId === undefined || stateId === undefined) {
            this.setState({
                errorSave: 'Selecione estado e cidade antes de selecionar todos os bairros.',
            })
        } else {
            if (neighborhoods.length === neighborhoodsSelecteds) {
                this.setState((state) => ({
                    ...state,
                    [name]: checked,
                    neighborhoodSelected: [],
                }))
            } else {
                this.setState((state) => ({
                    ...state,
                    [name]: checked,
                    neighborhoodSelected: neighborhoods.filter((neighborhood) => neighborhood.city._id === cityId),
                    inputs: {
                        ...state.inputs,
                        neighborhoods: neighborhoods.filter((neighborhood) => neighborhood.city._id === cityId).map((n) => n._id),
                    },
                }))
            }
        }
    }

    handleChangeNeighborhood = async (event: any, value: any, reason: any) => {
        const { cityId } = this.state
        const { addNeighborhood } = this.props

        const valuesToCreate = value.find((newValue: any) => !newValue._id)

        if (valuesToCreate !== undefined && cityId !== undefined) {
            this.setState(
                (state) => ({
                    ...state,
                    addingNeighborhood: true,
                }),
                async () => {
                    await addNeighborhood(valuesToCreate.value, cityId)
                    this.onLoad()
                }
            )
        } else {
            this.setState((state) => ({
                ...state,
                disabled: false,
                inputs: {
                    ...state.inputs,
                    neighborhoods: value.map((neighborhood: any) => neighborhood._id),
                },
                neighborhoodSelected: [...value],
            }))
        }
    }

    handleAddNewNeighborHood = (options: any, state: any) => {
        const { inputValue } = state
        const filterOptions = options.filter((neighborhood: any) =>
            neighborhood.name.toLowerCase().includes(inputValue.toLowerCase())
        )

        if (filterOptions.length <= 0) {
            filterOptions.push({
                value: inputValue.toUpperCase(),
                name: `Adicionar '${inputValue.toUpperCase()}'`,
            })
        }

        return filterOptions
    }

    handleChange = ({ target: { name, value } }: any) => {
        const { cities, neighborhoods } = this.props

        this.setState(
            (state) => ({
                ...state,
                errorSave: null,
                inputs: {
                    ...state.inputs,
                    [name]: value.replace('R$ ', '').replace(',', '.'),
                },
            }),
            () => {
                if (name === 'states') {
                    this.setState(
                        (state) => ({
                            ...state,
                            stateId: '',
                            cities: cities.filter((city) => city.state._id === value),
                            neighborhoods: [],
                            checked: false,
                            neighborhoodSelected: [],
                            inputs: {
                                ...state.inputs,
                                neighborhoods: undefined,
                            },
                        }),
                        () => {
                            this.setState({
                                stateId: value,
                            })
                        }
                    )
                }
                if (name === 'cities') {
                    this.setState(
                        (state) => ({
                            ...state,
                            cityId: '',
                            checked: false,
                            neighborhoodSelected: [],
                            neighborhoods: neighborhoods.filter((neighborhood) => neighborhood.city._id === value),
                            inputs: {
                                ...state.inputs,
                                neighborhoods: undefined,
                            },
                        }),
                        () => {
                            this.setState({
                                cityId: value,
                            })
                        }
                    )
                }
            }
        )
    }

    handleSubmit = () => {
        const { inputs } = this.state
        const { handleSave } = this.props
        handleSave(inputs)

        this.setState((state) => ({
            ...state,
            cities: [],
            checked: false,
            inputs: {
                feePrice: 0,
                freeFrom: 0,
                minimumPurchase: 0,
                deliveryTime: 0,
                neighborhoods: undefined,
            },
            neighborhoodSelected: [],
            neighborhoodIds: undefined,
        }))
    }

    _renderStates = () => {
        const { states } = this.props

        if (states.length > 0) {
            return states.map((state) => (
                <MenuItem key={state._id} value={state._id}>
                    {state.name}
                </MenuItem>
            ))
        }
    }

    _renderCities = () => {
        const { cities } = this.state

        if (cities.length > 0) {
            return cities.map((city) => (
                <MenuItem key={city._id} value={city._id}>
                    {city.name}
                </MenuItem>
            ))
        }
    }

    _renderFields = () => {
        const { classes } = this.props
        const {
            inputs: { feePrice, freeFrom, deliveryTime, minimumPurchase },
        } = this.state

        return (
            <div className={classes.wrapper}>
                <div className={classNames(classes.inputGroup, classes.valuesinputs)}>
                    <div className={classNames(classes.column, classes.mobilecenter)}>
                        <Typography className={classes.inputName}>Taxa de Entrega</Typography>
                        <NumberFormat
                            className={classes.columninput}
                            prefix={'R$ '}
                            isNumericString={true}
                            thousandSeparator={true}
                            name="feePrice"
                            defaultValue={0}
                            onChange={this.handleChange}
                            value={feePrice}
                        />
                    </div>
                    <div className={classNames(classes.column, classes.mobilecenter)}>
                        <Typography className={classes.inputName}>Grátis a partir de</Typography>
                        <NumberFormat
                            className={classes.columninput}
                            prefix={'R$ '}
                            isNumericString={true}
                            thousandSeparator={true}
                            name="freeFrom"
                            defaultValue={0}
                            onChange={this.handleChange}
                            value={freeFrom}
                        />
                    </div>
                    <div className={classNames(classes.column, classes.mobilecenter)}>
                        <Typography className={classes.inputName}>Mínimo para entrega</Typography>
                        <NumberFormat
                            className={classes.columninput}
                            prefix={'R$ '}
                            isNumericString={true}
                            thousandSeparator={true}
                            name="minimumPurchase"
                            defaultValue={0}
                            onChange={this.handleChange}
                            value={minimumPurchase}
                        />
                    </div>
                    <div className={classNames(classes.column, classes.mobilecenter)}>
                        <Typography className={classes.inputName}>Tempo de entrega</Typography>
                        <input className={classes.columninput} name="deliveryTime" onChange={this.handleChange} value={deliveryTime} />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { classes, fetching } = this.props
        const { neighborhoods, checked, neighborhoodSelected, errorSave } = this.state

        return (
            <React.Fragment>
                <div className={classes.wrapper}>
                    <div className={classes.inputGroup}>
                        <FormControl
                            variant="outlined"
                            classes={{
                                root: classes.formControl,
                            }}
                        >
                            <InputLabel>Estado</InputLabel>
                            <Select className={classes.select} name="states" onChange={this.handleChange} label="Estado">
                                {this._renderStates()}
                            </Select>
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            classes={{
                                root: classes.formControl,
                            }}
                        >
                            <InputLabel>Cidade</InputLabel>
                            <Select className={classes.select} name="cities" onChange={this.handleChange} label="Cidade">
                                {this._renderCities()}
                            </Select>
                        </FormControl>

                        <div className={classNames(classes.column, classes.neighborhood)}>
                            <Autocomplete
                                componentName="neighborhoods"
                                limitTags={2}
                                value={neighborhoodSelected}
                                options={neighborhoods}
                                getOptionLabel={(option) => option.name}
                                selectOnFocus
                                clearOnBlur
                                renderInput={(params) => <TextField {...params} label="Bairros" variant="outlined" />}
                                multiple
                                loading={fetching}
                                onChange={this.handleChangeNeighborhood}
                                filterOptions={this.handleAddNewNeighborHood}
                                renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => <Chip key={index} label={option.name} {...getTagProps({ index })} />)
                                }
                                ChipProps={{
                                    className: classes.chip,
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox name="checked" checked={checked} onChange={this.handleSelectAllNeigborhoods} />}
                                label="Adicionar todos os bairros"
                                labelPlacement="start"
                                classes={{
                                    label: classes.checkboxlabel,
                                }}
                            />
                            <Typography className={classes.error}>{errorSave}</Typography>
                        </div>
                    </div>
                </div>
                {this._renderFields()}
                <FormProvider>
                    <FormConsumer>
                        {({ onFormChange }) => {
                            return (
                                <Formized name="deliveries" onChange={onFormChange} onFinish={this.handleSubmit}>
                                    <button type="submit" className={classes.saveButton}>
                                        {fetching ? <CircularProgress size={20} color="secondary" /> : 'SALVAR'}
                                    </button>
                                </Formized>
                            )
                        }}
                    </FormConsumer>
                </FormProvider>
            </React.Fragment>
        )
    }
}

export default withStyles(style)(NewDeliveryPolitics)

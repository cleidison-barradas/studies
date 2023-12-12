import {
  Box,
  Grid,
  Stack,
  Button,
  Hidden,
  Checkbox,
  IconButton,
  Typography,
  FormControl,
  FormControlLabel,
} from '@mui/material'
import { Input } from '@mypharma/react-components'
import React, { useContext, useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import useSWR from 'swr'
import { SearchIcon, UncheckIcon, FormCheckIcon, CloseIcon } from '../../assets/icons'
import { ReturnButton } from '../../components/ReturnButton'
import categoryContext from '../../contexts/category.context'
import Manufacturer from '../../interfaces/manufacturer'
import { getCategoryManufacturers } from '../../services/category/category.service'

interface ManufacturerFormProps {
  onReturn: () => any
  onSubmit: (selected: Manufacturer[]) => any
}

export const ManufacturerForm: React.FC<ManufacturerFormProps> = ({ onReturn, onSubmit }) => {
  const { color } = useTheme()
  const {
    selectedSubCategory,
    selectedCategory,
    selectedManufacturers: contextSelected,
  } = useContext(categoryContext)

  useEffect(() => {
    setSelectedManufacturers(contextSelected)
  }, [contextSelected])

  const [search, setSearch] = useState('')

  const [selectedManufacturers, setSelectedManufacturers] = useState<Manufacturer[]>([])

  const { data: query } = useSWR(
    `category/manufacturers/${selectedSubCategory ? selectedSubCategory._id : selectedCategory!._id
    }`,
    () =>
      getCategoryManufacturers(
        selectedSubCategory ? selectedSubCategory._id : selectedCategory!._id
      )
  )

  const manufacturers = query && query.data ? query.data.manufacturers : []

  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    manufacturer: Manufacturer
  ) => {
    setSelectedManufacturers((oldValue) =>
      event.target.checked
        ? [...oldValue, manufacturer]
        : oldValue.filter(({ _id }) => _id !== manufacturer._id)
    )
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" position="relative" alignItems="center" justifyContent="center">
        <Hidden mdUp>
          <Box position="absolute" left="0">
            <ReturnButton onClick={onReturn} />
          </Box>
        </Hidden>
        <Typography fontSize={20} fontWeight={500}>
          Ordenar por marcas
        </Typography>
        <Hidden smDown>
          <Box position="absolute" right="0">
            <IconButton onClick={onReturn} style={{ color: color.neutral.dark }}>
              <CloseIcon height={20} />
            </IconButton>
          </Box>
        </Hidden>
      </Stack>
      <Stack pb={2} spacing={2} px={1}>
        <Input
          StartIcon={() => <SearchIcon />}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Busque pela marca"
        />
        <Grid px={0.5} justifyContent="space-between" maxHeight={171} overflow="auto" container>
          {manufacturers
            .filter((manufacturer) =>
              manufacturer.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(manufacturer => {
              const [firstname, lastname] = manufacturer.name.split(' ')
              const checked = selectedManufacturers.filter(_selected => manufacturer._id && _selected._id?.includes(manufacturer?._id)).length > 0
              const name = firstname.concat(lastname && lastname.length > 0 ? ` ${lastname}` : '')

              return (
                <Grid key={manufacturer._id} item xs={6} lg={4}>
                  <FormControl component="fieldset" variant="standard">
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<UncheckIcon />}
                          checked={checked}
                          onChange={(e) => handleOnChange(e, manufacturer)}
                          checkedIcon={<FormCheckIcon color={color.primary.medium} />}
                        />
                      }
                      label={
                        <Typography fontWeight={500}>
                          {name}
                        </Typography>
                      }
                    />
                  </FormControl>
                </Grid>
              )
            })}
        </Grid>
        <Button
          onClick={() => onSubmit(selectedManufacturers)}
          variant="contained"
          fullWidth
          color="primary"
        >
          Ver produtos
        </Button>
      </Stack>
    </Stack>
  )
}

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useTheme } from 'styled-components'
import flagBrazil from '../../assets/flags/brazil.svg'
import { MailBox } from '../../assets/ilustration'
import { CEP_VALIDATION } from '../../helpers/regexes'
import StoreGroups from '../../interfaces/storeGroups'
import StoreUrls from '../../interfaces/storeUrls'
import { getStoresByCEP } from '../../services/location/location.service'
import { IReturnStoreThatDelivery } from '../../services/location/response.interface'
import { StoreLinkCard } from './styles'

interface RedirectContentProps {
  urls?: StoreUrls[]
  groups?: StoreGroups
}

export const RedirectContent: React.FC<RedirectContentProps> = ({ urls, groups }) => {
  const [cep, setCep] = useState<string>('')
  const [fetching, setFetching] = useState<boolean>(false)
  const [storesGrouped, setStoreGrouped] = useState<IReturnStoreThatDelivery[] | undefined>([])
  const { color } = useTheme()

  const handleChange = (event: SelectChangeEvent<string>) => {
    window.location.href = `${
      event.target.value.endsWith('/')
        ? event.target.value.concat('produtos?noredirect')
        : event.target.value.concat('/produtos?noredirect')
    }`
  }

  const handleSubmit = async () => {
    if (CEP_VALIDATION.test(cep)) {
      setFetching(true)
      const response = await getStoresByCEP(cep)
      if (response) {
        setStoreGrouped(response.groups)
      }
      setFetching(false)
    }
  }

  return (
    <Stack spacing={5} justifyContent="center" alignItems="center">
      <MailBox color={color.primary.medium} />
      {urls && urls.length > 0 ? (
        <React.Fragment>
          <Typography>Nos diga onde você está para te direcionarmos à loja mais próxima</Typography>
          <React.Fragment>
            <FormControl fullWidth>
              <InputLabel id="local_label">Selecione uma localidade</InputLabel>
              <Select
                value=""
                onChange={handleChange}
                label="Selecione uma localidade"
                labelId="local_label"
              >
                {urls?.map((url, index) => {
                  return (
                    <MenuItem key={index} value={url.url_address}>
                      {url.url_name}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </React.Fragment>
        </React.Fragment>
      ) : groups &&
        typeof groups.stores === 'object' &&
        storesGrouped &&
        storesGrouped.length > 0 ? (
        <Stack spacing={2} width="100%">
          {storesGrouped.map((store, index) => (
            <StoreLinkCard key={index}>
              <Typography
                fontWeight={500}
                color={color.neutral.darkest}
                fontSize={16}
                textAlign="center"
              >
                {store.storeName}
              </Typography>
              <Typography color={color.neutral.darkest} fontSize={16} textAlign="center">
                {store.storeAddress.street}, {store.storeAddress.number}, {store.storeAddress.city}
              </Typography>

              {String(store?.distance)?.split('.')[0] === '0' ? (
                <Typography color={color.neutral.darkest} fontSize={16} textAlign="center">
                  Você está localizado na mesma cidade da farmácia.
                </Typography>
              ) : (
                <Typography color={color.neutral.darkest} fontSize={16} textAlign="center">
                  Você está localizado há{' '}
                  <span style={{ fontWeight: 'bold' }}>
                    {String(store?.distance)?.split('.')[0]}
                    {String(store?.distance)?.split('.')[1]?.substring(0, 1) &&
                      `,${String(store?.distance)?.split('.')[1]?.substring(0, 1)} `}
                  </span>{' '}
                  {''}
                  Km da farmácia.
                </Typography>
              )}

              {store.label && (
                <Stack
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    color={color.neutral.darkest}
                    fontSize={16}
                    textAlign="center"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {store.label}
                  </Typography>
                  <img src={flagBrazil} alt="Flag Brasil" height={24} />
                </Stack>
              )}

              <Button
                sx={{ paddingX: 6 }}
                LinkComponent={Link}
                href={`${
                  store.storeUrl.endsWith('/')
                    ? store.storeUrl.concat('produtos?noredirect')
                    : store.storeUrl.concat('/produtos?noredirect')
                }`}
                target="_self"
                variant="contained"
                color="primary"
              >
                Navegar para essa loja
              </Button>
            </StoreLinkCard>
          ))}
        </Stack>
      ) : (
        <Stack gap={1}>
          <Typography mb={1} textAlign={'center'} fontSize={16}>
            Localizaremos as farmácias máis próximas
          </Typography>
          <Typography textAlign={'center'} fontSize={14}>
            Digite seu CEP e nos diga onde você está
          </Typography>
          <InputMask
            mask="99999-999"
            value={cep}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const onlyNums = event.target.value.replace(/[^0-9]/g, '')
              setCep(onlyNums)
            }}
          >
            {(inputProps: any) => (
              <TextField fullWidth label="CEP" variant="outlined" {...inputProps} />
            )}
          </InputMask>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              disabled={cep.length !== 8}
              onClick={handleSubmit}
              fullWidth
              endIcon={fetching && <CircularProgress color="secondary" size={18} />}
            >
              {fetching ? 'Buscando...' : 'Buscar'}
            </Button>
          </Box>
        </Stack>
      )}
    </Stack>
  )
}

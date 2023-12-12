import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { ChampainUserFound } from '../../assets/ilustration'
import { Button, CampaignNotFoundImage } from './styles'
import { putPBMAuthorization } from '../../services/epharma/epharma.service'
import { Form, Formik } from 'formik'
import { useAlert } from '../../hooks/useAlert'
import { ICampaingProps } from '../LaboratoryCampaign'
import { ErrorCodes } from '../../helpers/errorCodes'
import { useCart } from '../../hooks/useCart'

interface Props {
  ean: string
  fingerprint: string
  onFinish: React.Dispatch<React.SetStateAction<ICampaingProps>>
}

interface InitialValues {
  ean: string
  fingerprint: string
}

const PbmContainerDiscountSuccess: React.FC<Props> = ({ ean, fingerprint, onFinish }) => {
  const { showMessage } = useAlert()
  const { setAuthorization } = useCart()

  const initialValues: InitialValues = {
    ean,
    fingerprint
  }

  const handleChange = async (data: InitialValues) => {
    try {
      const response = await putPBMAuthorization(data)

      if (response) {
        const { error } = response

        if (error) {

          return showMessage(ErrorCodes(error), 'error')
        }
        setAuthorization(response.authorization)
        onFinish({ needsDoctorData: false, needsRegister: false })
      }

    } catch (error) {
      showMessage(`Ocorreu um problema ${error}`, 'error')
    }
  }


  return (
    <Box
      display='flex'
      borderRadius={5}
      flexDirection='column'
      border='1px solid #E0E8F0'
    >
      <Stack
        borderRadius='20px'
        sx={{ background: '#B7FFCC' }}
      >
        <Box
          display='flex'
          alignItems='center'
          marginTop={1}
          marginLeft={3}
          marginRight={3}
        >
          <Box>
            <Typography
              fontSize={28}
              fontWeight='bold'
            >
              Que ótimo! </Typography>
            <Typography
              fontFamily='Montserrat'
              fontSize={11}
            >Informamos acima o preço do produto com o desconto mínimo oferecido pelo programa. O valor de desconto pode variar de acordo com os itens da cesta, quantidade do produto, CPF, cartão ou cupom informado

            </Typography>
          </Box>
          <Box>
            <CampaignNotFoundImage>
              <ChampainUserFound />
            </CampaignNotFoundImage>

          </Box>
        </Box>
        <Stack
          spacing={2}
          direction='row'
          marginLeft={3}
          marginRight={3}
          marginBottom={3}
        >
          <Formik initialValues={initialValues} onSubmit={handleChange} enableReinitialize>
            {
              () => (
                <Form>
                  <Box>
                    <Button type='submit'>Cancelar desconto</Button>
                  </Box>
                </Form>
              )
            }
          </Formik>

        </Stack>
      </Stack>
    </Box>
  )
}

export default PbmContainerDiscountSuccess

import React, { useEffect, useState } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import useSWR from 'swr'

import { Box, Stack, Typography, Button, Grid, Link, MenuItem, FormControl, FormLabel, RadioGroup, CircularProgress } from '@mui/material'

import { getMemberRegisterConfiguration, postMemberRegister } from '../../services/epharma/epharma.service'
import { RequestBeneficiaryMemberRegister } from '../../services/epharma/request.interface'
import { RegisterDefaultField, RegisterField, RegisterQuiz } from '../../interfaces/epharma'


import RadioButtonFormField from '../RadioButtonFormField'
import CheckBoxFormField from '../CheckBoxFormField'
import SelectFormField from '../SelectFormField'
import { MaskedInput } from '../MaskedInput'
import { useAlert } from '../../hooks/useAlert'

import { ChampainUserNotFound } from '../../assets/ilustration'
import { CampaignNotFoundImage } from '../LaboratoryCampaign/styles'

import TextFormField from '../TextFormField'
import { Benefit } from '../../interfaces/benefit'
import { ICampaingProps } from '../LaboratoryCampaign'

interface Props {
  ean: string
  benefit: Benefit
  benefitId: number
  allowCustomMembership: boolean
  onFinish: React.Dispatch<React.SetStateAction<ICampaingProps>>
}

const PbmContainerRegister: React.FC<Props> = ({ ean, benefit, benefitId, allowCustomMembership = false, onFinish }) => {
  const { data } = useSWR(
    allowCustomMembership && benefitId ?
      `beneficiary/register/configuration/${benefitId}` :
      undefined, async () => await getMemberRegisterConfiguration({ benefitId, eans: [ean] }))

  const [fields, setFields] = useState<RegisterField[]>([])
  const [defaultFields, setDefaultFields] = useState<RegisterDefaultField[]>([])
  const [quiz, setQuiz] = useState<RegisterQuiz[]>([])
  const { showMessage } = useAlert()

  const ignoreFields: number[] = [4, 5, 33, 57]


  useEffect(() => {
    if (data) {
      setFields(data.fields)
      setQuiz(data.quiz)
      setDefaultFields(data.defaultFields)
    }
  }, [data])

  const handleRegisterMember = async (dataFields: RequestBeneficiaryMemberRegister) => {
    try {

      const response = await postMemberRegister({ ...dataFields })

      if (response?.error) {

        return showMessage(`Ocorreu um problema ao realizar cadastro`, 'error')
      }

      showMessage('cadastro realizado com sucesso', 'success')
      onFinish({ needsDoctorData: false, needsRegister: false })

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
        sx={{ background: '#FFFF81' }}
      >
        <Box
          display='flex'
          alignItems='center'
          marginTop={1}
          marginLeft={3}
          marginRight={3}
        >
          <Grid container>
            <Grid item xs={12} sm={6} lg={6} xl={6}>
              <Box mt={5} >
                <Typography
                  fontSize={28}
                  style={{ color: '#BD0B0B' }}
                  fontWeight='bold'
                >Ops
                </Typography>

                <Typography
                  fontSize={14}
                  fontFamily='Poppins'

                  style={{ color: '#BD0B0B' }}
                >Não localizamos seu cadastro!
                </Typography>

                <Typography
                  fontFamily='Montserrat'
                  fontSize={12}
                >
                  O CPF informado não está cadastrado no programa do laboratório. Faça seu cadastro para obter benefícios do programa.
                </Typography>

              </Box>

            </Grid>
            <Grid item xs={12} sm={6} lg={6} xl={6}>
              <CampaignNotFoundImage>
                <ChampainUserNotFound />
              </CampaignNotFoundImage>
            </Grid>
          </Grid>
        </Box>
        <Stack
          spacing={2}
          marginLeft={3}
          marginRight={3}
          marginBottom={3}
        >
          <Formik
            initialValues={{
              eans: [ean],
              benefitId,
              fields: null,
              defaultFields,
              defaultQuiz: quiz
            }}
            onSubmit={handleRegisterMember}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form>
                {allowCustomMembership && fields.length > 0 ? (
                  <Grid container spacing={1}>

                    {fields.filter(_field => !ignoreFields.includes(_field.columnId)).map(field => {

                      const fieldName = `fields.fields.${field.apiAlias}_${field.columnId}`

                      return (
                        <Grid key={field.columnId} item xs={12} sm={6} lg={6} xl={6}>
                          {field.mask ? (
                            <Field
                              required
                              fullWidth
                              name={fieldName}
                              as={MaskedInput}
                              mask={field.mask}
                              autoComplete='off'
                              label={field.label}
                              style={{ background: '#fff' }}
                            />
                          ) : field.type === 'select' ? (
                            <Field
                              required
                              name={fieldName}
                              label={field.label}
                              component={SelectFormField}
                              style={{ background: '#fff' }}
                            >
                              {field.allowedValues && field.allowedValues.map(allowedValue => (
                                <MenuItem key={allowedValue.id} value={allowedValue.value}>
                                  {allowedValue.label}
                                </MenuItem>
                              ))}
                            </Field>
                          ) : (
                            <Field
                              required
                              name={fieldName}
                              autoComplete='off'
                              label={field.label}
                              component={TextFormField}
                              style={{ background: '#fff' }}
                            />
                          )}
                        </Grid>
                      )
                    })}
                    {quiz.length > 0 && (
                      <Grid item xs={12}>
                        {quiz.map(_quiz => {

                          return (
                            <Box key={_quiz.id} >
                              <Box mt={3} mb={3}>
                                <Typography>Medicamento: <b>{_quiz.name}</b></Typography>
                              </Box>

                              <Grid container spacing={3} >
                                {_quiz.questions.map(question => {

                                  const quizName = `fields.quiz.${question.questionAlias}_${question.id}`

                                  return (
                                    <Grid key={question.id} item xs={12}>
                                      {question.questionType === 'Checkbox' ? (
                                        <Field name={quizName} label={question.title} component={CheckBoxFormField} />
                                      ) : question.questionType === 'RadioButton' ? (
                                        <Field name={quizName}>
                                          {({ form, field }: FieldProps) => (
                                            <FormControl>
                                              <FormLabel>{question.title}</FormLabel>
                                              <RadioGroup
                                                row
                                                onChange={(_, value) => form.setFieldValue(quizName, value)}
                                                value={field.value}
                                              >
                                                {question.allowedValues.map(allowedValue => (
                                                  <RadioButtonFormField key={allowedValue.id} label={allowedValue.label} value={allowedValue.value} />
                                                ))}

                                              </RadioGroup>
                                            </FormControl>
                                          )}
                                        </Field>
                                      ) : question.questionType === 'Lista' ? (
                                        <Field
                                          label={question.title}
                                          name={quizName}
                                          component={SelectFormField}
                                        >
                                          {question.allowedValues.map(allowedValue => (
                                            <MenuItem key={allowedValue.id} value={allowedValue.value}>
                                              {allowedValue.label}
                                            </MenuItem>
                                          ))}
                                        </Field>
                                      ) : question.questionAlias === 'Question_Responsible_Birth_Date' ? (
                                        <Field
                                          required
                                          fullWidth
                                          name={quizName}
                                          as={MaskedInput}
                                          mask="99/99/9999"
                                          autoComplete='off'
                                          label={question.title}
                                          style={{ background: '#fff' }}
                                        />
                                      ) : question.questionAlias === 'Question_Responsible_Document' ? (
                                        <Field
                                          required
                                          fullWidth
                                          name={quizName}
                                          as={MaskedInput}
                                          mask="999.999.999-99"
                                          autoComplete='off'
                                          label={question.title}
                                          style={{ background: '#fff' }}
                                        />
                                      ) : (
                                        <Field
                                          required
                                          name={quizName}
                                          autoComplete='off'
                                          label={question.title}
                                          component={TextFormField}
                                          style={{ background: '#fff' }}
                                        />
                                      )}
                                    </Grid>
                                  )
                                })}
                              </Grid>
                            </Box>
                          )
                        })}
                      </Grid>
                    )}
                    <Box />
                    <Box width="100%" mt={2} padding="0 8px">
                      <Button
                        type='submit'
                        style={{
                          color: '#BD0B0B',
                          fontFamily: 'Poppins',
                          background: '#FFA4A4',
                          border: 'none'
                        }}
                      >
                        {isSubmitting ? <CircularProgress size={20} /> : 'Cadastrar'}
                      </Button>
                      <Button
                        onClick={() => onFinish({ needsDoctorData: false, needsRegister: false })}
                        style={{
                          fontFamily: 'Poppins',
                          border: 'none'
                        }}
                      >
                        Cancelar</Button>
                    </Box>
                  </Grid>

                ) : (
                  <Grid container spacing={1}>
                    <Grid item>
                      <Link
                        href={benefit?.siteUrl}
                        underline='none'
                        target="_blank"
                        rel='noreferrer'
                        onClick={() => onFinish({ needsDoctorData: false, needsRegister: false })}
                      >
                        Cadastre-se pelo site</Link>
                    </Grid>
                    <Grid item>
                      <Typography>ou pelo telefone {benefit?.phone}</Typography>
                    </Grid>
                  </Grid>
                )}
              </Form>
            )}
          </Formik>
        </Stack>
      </Stack>
    </Box>
  )
}

export default PbmContainerRegister

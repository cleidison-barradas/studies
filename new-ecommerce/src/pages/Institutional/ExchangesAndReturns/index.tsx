import { Stack, Typography } from '@mui/material'
import React from 'react'
import { BackArrowIcon } from '../../../assets/icons'
import { useNavigate } from 'react-router'
import { AboutUsHelmet } from '../../../components/AboutUsHelmet'
import { ReturnButton } from '../../AboutUs/styles'
import { PolicyParagraph, PolicyClause } from '../components/PolicyTextElements'

export const ExchangesAndReturns: React.FC = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <AboutUsHelmet />
      <Stack mb={5} alignItems="center" mt={2} direction="row" spacing={2}>
        <ReturnButton onClick={() => navigate('/')}>
          <BackArrowIcon />
        </ReturnButton>
        <Typography variant="h1" color="#616D78" fontSize={{ lg: 30, xs: 18 }}>
          Trocas e devoluções
        </Typography>
      </Stack>
      <Stack>
        <Typography mb={3} variant="h4">
          POLÍTICA DE TROCA, DEVOLUÇÃO E ARREPENDIMENTO
        </Typography>
        <PolicyParagraph>
          <PolicyClause>
            Este e-commerce utiliza tecnologia de ponta, primando pela qualidade e satisfação de
            seus clientes. Pelo respeito e para que seja mantida a credibilidade conquistada junto
            aos seus consumidores, a empresa criou uma política de troca e devolução de acordo com o
            Código de Defesa do Consumidor, e preocupada para que você (cliente) obtenha uma
            negociação eficaz, ágil e principalmente satisfatória.
          </PolicyClause>
          <PolicyClause>
            Caso opte pelo contato via correio eletrônico ou telefônico, será encaminhado a você o
            formulário para preenchimento e envio junto à(s) peça(s). O produto devolvido sem esse
            formulário e/ou sem a comunicação ao SAC será reenviado sem consulta prévia.
          </PolicyClause>
          <PolicyClause>
            Ao efetuar o processo de devolução/troca o cliente deverá no verso da nota fiscal a ser
            devolvida/trocada, informar o motivo da devolução/troca, o nome de quem está devolvendo,
            CPF e a data da devolução.
          </PolicyClause>
          <PolicyClause>
            <Typography sx={{ fontWeight: 'bold' }} component="span">
              *ATENÇÃO*
            </Typography>
            : Para efetuar o processo de troca é necessário estar logado. Devolução por
            Arrependimento/Desistência Se ao receber o produto, você resolver devolvê-lo por
            arrependimento, deverá fazê-lo em até sete dias corridos, a contar da data de
            recebimento.
          </PolicyClause>
          <PolicyClause>
            Observando as seguintes condições: O produto não poderá ter indícios de uso.
          </PolicyClause>
          <PolicyClause>
            O produto deverá ser encaminhado preferencialmente na embalagem original, acompanhado de
            nota fiscal, etiquetas, tags (etiqueta com código de referência do produto) devidamente
            fixada no produto e todos os seus acessórios.
          </PolicyClause>

          <PolicyClause>
            Ao efetuar o processo de devolução o cliente deverá no verso da nota fiscal a ser
            devolvida, informar o motivo da recusa/devolução, o nome de quem está devolvendo, CPF e
            a data da devolução.
          </PolicyClause>
        </PolicyParagraph>
      </Stack>
    </React.Fragment>
  )
}

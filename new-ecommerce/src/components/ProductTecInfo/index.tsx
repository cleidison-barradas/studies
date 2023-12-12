import { Typography, Stack, Link } from '@mui/material'
import React from 'react'
import Product from '../../interfaces/product'
import { TecInfoCard } from './styles'

interface ProdutTecInfoProps {
  product: Product
}

export const ProdutTecInfo: React.FC<ProdutTecInfoProps> = ({ product }) => {
  const { EAN, manufacturer, MS, activePrinciple, leaflet } = product

  return (
    <TecInfoCard>
      <Typography mb={2} fontSize={18} textAlign="left">
        Ficha técnica
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography> EAN (código de barras) </Typography>
        <Typography> {EAN} </Typography>
      </Stack>
      {manufacturer && (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography> Marca </Typography>
          <Typography> {manufacturer?.name || '--'} </Typography>
        </Stack>
      )}
      {activePrinciple && (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography> Principio ativo </Typography>
          <Typography> {activePrinciple || '--'} </Typography>
        </Stack>
      )}
      {MS && (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography> Codigo MS </Typography>
          <Typography> {MS || '--'} </Typography>
        </Stack>
      )}
      {leaflet && (
        <Link target="_blank" rel="noopener noreferrer" href={leaflet}>
          Acessar bula
        </Link>
      )}
    </TecInfoCard>
  )
}

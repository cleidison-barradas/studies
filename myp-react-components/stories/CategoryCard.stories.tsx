import { Box, Grid } from '@material-ui/core'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { CategoryCard, ThemeProvider } from '../src'
import { CategoryProps } from '../src/components/CategoryCard'

const examples = [
  'Promoções',
  'Medicamentos',
  'Higiene Pessoal',
  'Beleza e Cuidados',
  'Mamães e Bebês',
  'Linha Infantil',
  'Pare de Fumar',
  'Saúde Sexual',
  'Suplementos e Vitaminas',
  'Dermo',
]

export default {
  title: 'Example/CategoryCard',
  component: CategoryCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    color: {
      defaultValue: 'discount',
    },
  },
} as Meta

const Template: Story<CategoryProps> = (args) => (
  <Box mt={10}>
    <Grid container wrap="nowrap" alignItems="center" spacing={2}>
      {examples.map((value) => (
        <Grid item>
          <CategoryCard> {value} </CategoryCard>
        </Grid>
      ))}
    </Grid>
  </Box>
)

export const Default = Template.bind({})

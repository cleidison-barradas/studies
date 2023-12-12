import { Meta, Story } from '@storybook/react'
import {
  ThemeProvider,
  SubCategory,
  SubCategoryButton,
} from '../src/components'
import React, { useState } from 'react'
import { PromotionIcon, PriceIcon, OrderByIcon } from '../src/icons'
import { Box } from '@material-ui/core'

export default {
  title: 'Components/SubCategory',
  component: SubCategory,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} as Meta

const subcategorys = [
  'Tintura',
  'Colônias',
  'Maquiagens',
  'Escova e Acessórios',
]

const Filters = [
  {
    Icon: () => <OrderByIcon />,
    title: 'Ordem Alfabética',
    name: 'asc',
  },
  {
    Icon: () => <PriceIcon />,
    title: 'Preço',
    name: 'price',
  },
  {
    Icon: () => <PromotionIcon />,
    title: 'Promoção',
    name: 'promotion',
  },
]

const Template: Story = () => {
  const [selected, setSelected] = useState('')
  return (
    <Box p={2}>
      <SubCategory
        initialFilter="asc"
        filters={Filters}
        title={'Beleza e Cuidados'}
      >
        {subcategorys.map((value) => (
          <SubCategoryButton
            selected={selected === value}
            onClick={() => setSelected(value)}
          >
            {value}
          </SubCategoryButton>
        ))}
      </SubCategory>
    </Box>
  )
}

export const Default = Template.bind({})

import { Meta, Story } from '@storybook/react'
import React from 'react'
import { ProductSkeleton, ThemeProvider } from '../src'

export default {
  title: 'Components/Skeletons/Product',
  component: ProductSkeleton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} as Meta

export const Default: Story = () => (
  <ProductSkeleton />
)
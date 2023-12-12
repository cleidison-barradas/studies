import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BannerSkeleton, ThemeProvider } from '../src'

export default {
  title: 'Components/Skeletons/Banner',
  component: BannerSkeleton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ]
} as Meta

export const Default: Story = () => (
  <BannerSkeleton />
)
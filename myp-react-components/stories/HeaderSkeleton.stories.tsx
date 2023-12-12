import { Meta, Story } from '@storybook/react'
import React from 'react'
import { HeaderSkeleton, ThemeProvider } from '../src'

export default {
  title: 'Components/Skeletons/Header',
  component: HeaderSkeleton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} as Meta

export const Default: Story = () => (
  <HeaderSkeleton />
)
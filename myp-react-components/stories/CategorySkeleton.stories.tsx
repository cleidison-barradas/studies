import { Box } from '@material-ui/core'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { CategorySkeleton, ThemeProvider } from '../src'
import { CategorySkeletonProps } from '../src/components/Skeletons/Category'

export default {
  title: 'Components/Skeletons/Category',
  component: CategorySkeleton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    slider: { type: 'boolean' }
  },
} as Meta

export const Default: Story<CategorySkeletonProps> = (args) => (
    <Box mt={10}>
        <CategorySkeleton {...args} />
    </Box>
)
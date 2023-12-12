import { Meta, Story } from '@storybook/react'
import React from 'react'
import { Tag, ThemeProvider } from '../src'
import { TagProps } from '../src/components/Tag'

export default {
  title: 'Components/Tag',
  component: Tag,
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

const Template: Story<TagProps> = (args) => <Tag {...args}>Compre 1 leve 2</Tag>

export const Default = Template.bind({})

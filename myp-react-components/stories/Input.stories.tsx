import { Meta, Story } from '@storybook/react'
import React from 'react'
import { Input, SearchIcon, ThemeProvider } from '../src'
import { InputProps } from '../src/components/Input'

export default {
  title: 'Components/Input',
  component: Input,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    color: { options: ['primary', 'secondary'] },
  },
} as Meta

const Template: Story<InputProps> = (args) => (
  <Input type="text" StartIcon={SearchIcon} placeholder="Input" {...args} />
)

export const Default = Template.bind({})

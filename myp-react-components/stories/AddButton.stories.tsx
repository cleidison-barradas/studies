import { Meta, Story } from '@storybook/react'
import { ThemeProvider, AddButton } from '../src'
import React from 'react'
import { AddButtonProps } from '../src/components/AddButton'

export default {
  title: 'Components/AddButton',
  component: AddButton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    color: { options: ['primary', 'secondary'] },
    disabled: { type: 'boolean' },
    removeDecrease: { type: 'boolean' },
  },
} as Meta

const Template: Story<AddButtonProps> = (args) => <AddButton {...args} />

export const Default = Template.bind({})

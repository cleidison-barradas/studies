import { Meta, Story } from '@storybook/react'
import React from 'react'
import { FloatingButton, ThemeProvider, WhatsappIcon } from '../src'
import { FloatingButtonProps } from '../src/components/FloatingButton'

export default {
  title: 'Components/FloatingButton',
  component: FloatingButton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    color: { control: 'color', defaultValue: '#00BF91' },
  },
} as Meta

const Template: Story<FloatingButtonProps> = (args) => (
  <FloatingButton {...args}>
    <WhatsappIcon />
  </FloatingButton>
)

export const Default = Template.bind({})

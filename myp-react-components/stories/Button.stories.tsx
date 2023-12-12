import { Button, ThemeProvider } from '../src'
import { Meta, Story } from '@storybook/react'
import { ButtonProps } from '../src/components/Button'

export default {
  title: 'Components/Button',
  component: Button,
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
  },
} as Meta

const Template: Story<ButtonProps> = (args) => (
  <Button {...args}> Botão </Button>
)

export const Default = Template.bind({})

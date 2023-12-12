import { Meta, Story } from '@storybook/react'
import React from 'react'
import { Banner, ThemeProvider } from '../src'
import { BannerProps } from '../src/components/Banner'
const BannerExample = require('../src/assets/image-mobile.png')

export default {
  title: 'Components/Banner',
  component: Banner,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} as Meta

const Template: Story = () => (
  <Banner image={BannerExample} text="Acessou, pediu, chegou!" />
)

export const Default = Template.bind({})

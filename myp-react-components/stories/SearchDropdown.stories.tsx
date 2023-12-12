import { Meta, Story } from '@storybook/react'
import React from 'react'
import { Input, SearchAvatar, SearchDropdown, SearchIcon, SearchItem, SearchTitle, ThemeProvider } from '../src'
import { InputProps } from '../src/components/Input'

export default {
  title: 'Example/SearchDropdown',
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

const Template: Story<InputProps> = ({ size, ...args }) => (
  <SearchDropdown
    type="text"
    searchIcon={SearchIcon}
    placeholder="Procure um produto"
    {...args}
  >
    <SearchItem>
      <SearchAvatar
        background={
          'https://s3-us-west-2.amazonaws.com/myp-public/products/cef25271497627c99feca54857230c98.jpg'
        }
      />
      <SearchTitle>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
        exercitationem magni odio quasi tenetur provident, delectus soluta
      </SearchTitle>
    </SearchItem>
  </SearchDropdown>
)

export const Default = Template.bind({})

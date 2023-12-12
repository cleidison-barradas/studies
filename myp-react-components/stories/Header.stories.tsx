import { Meta, Story } from '@storybook/react'
import { Grid } from '@material-ui/core'
import {
  ExampleLogo,
  Header,
  SearchAvatar,
  SearchDropdown,
  SearchItem,
  SearchTitle,
  ThemeProvider,
} from '../src'
import React from 'react'
import { HeaderProps } from '../src/components/Header'
import { ReactComponent as SearchIcon } from '../src/icons/Search.svg'
export default {
  title: 'Components/Header',
  component: Header,
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

const Template: Story<HeaderProps> = (args) => (
  <Header {...args}>
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <ExampleLogo />
      <div>
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
      </div>
    </Grid>
  </Header>
)

export const Default = Template.bind({})

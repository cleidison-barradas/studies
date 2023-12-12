import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { TabBar, TabBarButton, ThemeProvider } from '../src'
import { TabBarProps } from '../src/components/TabBar'

// Icons
import { BasketIcon, HomeIcon, MenuIcon, UserIcon } from '../src/icons'

export default {
  title: 'Components/TabBar',
  component: TabBar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} as Meta

const tabs = [
  { Icon: HomeIcon, text: 'Início' },
  { Icon: UserIcon, text: 'sua conta' },
  { Icon: BasketIcon, text: 'cesta' },
  { Icon: MenuIcon, text: 'menu' },
]

const Template: Story<TabBarProps> = ({ ...args }) => {
  const [active, setActive] = useState(0)

  return (
    <TabBar>
      {tabs.map(({ Icon, text }, index) => (
        <TabBarButton
          onClick={() => setActive(index)}
          active={index === active}
        >
          <Icon />
          {text}
        </TabBarButton>
      ))}
    </TabBar>
  )
}

export const Default = Template.bind({})

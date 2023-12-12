import { Box, Grid } from '@material-ui/core'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BannerSkeleton, CategorySkeleton, HeaderSkeleton, ProductSkeleton, ThemeProvider, TitleSkeleton } from '../src'

const categoryRender = [1, 2, 3, 4, 5, 6, 7]
const bannerRender = [1, 2, 3]
const showcaseRender = [1, 2, 3, 4, 5, 6]

export default {
  title: 'Example/Skeleton',
  component: HeaderSkeleton,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ]
} as Meta

const Template: Story = () => (
  <Box>
    <HeaderSkeleton />
    <Box overflow="auto" mt={{ lg: 4, md: 4, sm: 0, xs: 0 }} pt={8} pb={2}>
        <Grid spacing={{ sm: 2, md: 4 }} wrap="nowrap" container>
        {categoryRender.map((item) => (
            <Grid item key={item}>
                <CategorySkeleton />
            </Grid>
        ))}
        </Grid>
    </Box>
    <Box mt={4}>
        <Grid container overflow="auto" wrap="nowrap" spacing={2}>
            {bannerRender.map((item) => (
            <Grid key={item} item>
                <BannerSkeleton />
            </Grid>
            ))}
        </Grid>
    </Box>
    <Box marginY={2}>
        <TitleSkeleton />
    </Box>
    <Box mt={4}>
        <Grid container wrap="nowrap" alignItems="center" spacing={2} overflow="auto">
            {showcaseRender.map((item) => (
                <Grid item key={item}>
                    <ProductSkeleton />
                </Grid>
            ))}
        </Grid>
    </Box>
  </Box>
)

export const Default = Template.bind({})

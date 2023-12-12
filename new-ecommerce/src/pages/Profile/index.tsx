import React from 'react'
import { Box } from '@mui/material'
import { ProfileContainer } from '../../components/ProfileContainer'

const Profile: React.FC = () => {
  return (
    <Box display="flex" width="100%" justifyContent="center">
      <ProfileContainer />
    </Box>
  )
}

export default Profile

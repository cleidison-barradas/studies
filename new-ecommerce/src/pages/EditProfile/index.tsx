import React from 'react'
import { useNavigate } from 'react-router'
import { EditProfileContainer } from '../../components/EditProfileContainer'
import { Typography, Box, Stack } from '@mui/material'
import { ReturnButton } from '../../components/ReturnButton'

const EditProfile: React.FC = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mt={3}>
        <ReturnButton onClick={() => navigate(-1)} />
        <Box>
          <Typography fontSize={20}>Edite seus dados</Typography>
        </Box>
      </Stack>
      <Box display="flex" justifyContent="center" width="100%">
        <EditProfileContainer />
      </Box>
    </React.Fragment>
  )
}

export default EditProfile

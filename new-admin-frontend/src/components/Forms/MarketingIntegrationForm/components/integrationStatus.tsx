import { Box, Typography } from '@material-ui/core'
import { Component } from 'react'

interface Props {
  status: string
}

export class IntegrationStatus extends Component<Props> {
  render() {
    const { status } = this.props

    const statusDictionary = {
      integrated: {
        label: 'Integrado',
        color: '#00C853',
      },
      error: {
        label: 'Erro na integração, contate o suporte',
        color: '#F44336',
      },
      not_integrated: {
        label: 'Não integrado, aguarde até a integração ser registrada',
        color: '#FF9800',
      },
      error_first_load: {
        label: 'Erro ao executar sincronização inicial, contate o suporte',
        color: '#F44336',
      },
    }

    const statusKey = status as keyof typeof statusDictionary

    return (
      <Box>
        <Typography variant="body2" component="span" style={{ marginRight: 5 }}>
          Status da integração:
        </Typography>
        <Box
          style={{
            backgroundColor: status ? statusDictionary[statusKey]?.color : statusDictionary['not_integrated'].color,
            borderRadius: '50%',
            width: '10px',
            height: '10px',
            display: 'inline-block',
            marginRight: '5px',
          }}
        />
        <Typography variant="body2" component="span">
          {status ? statusDictionary[statusKey]?.label : statusDictionary['not_integrated'].label}
        </Typography>
      </Box>
    )
  }
}

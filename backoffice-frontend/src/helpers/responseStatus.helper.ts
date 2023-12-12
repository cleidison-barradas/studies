export interface ResponseStatus {
    code: string
    message: string
    hidden: boolean
    severity: 'error' | 'info' | 'success' | 'warning'
    forceLogout: boolean
}

const errorCodes: ResponseStatus[] = [
    {
        code: 'invalid_credential',
        message: 'Usuário ou senha incorretos',
        hidden: false,
        forceLogout: true,
        severity: 'warning',
    },
    {
        code: 'missing_authorization',
        message: 'Falha de autenticação',
        hidden: false,
        severity: 'warning',
        forceLogout: true,
    },
    {
        code: 'session_expired',
        message: 'Login expirado',
        severity: 'warning',
        hidden: false,
        forceLogout: true,
    },
    {
        code: 'email_or_userName_already_exists',
        message: 'Email ou nome de usuario já existente',
        severity: 'error',
        hidden: false,
        forceLogout: true,
    },
    {
        code: 'NETWORK_ERROR',
        message: 'Problemas de conexão, tente novamente mais tarde',
        severity: 'warning',
        hidden: false,
        forceLogout: false,
    },
]

export default errorCodes

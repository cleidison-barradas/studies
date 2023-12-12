/* eslint-disable react-hooks/exhaustive-deps */
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AlertNotification2 from '../../assets/images/ExpirationAlert2.png'
import AlertNotification from '../../assets/images/expirationAlert.png'
import NotificationContext, { NOTIFICATION_KEY } from '../../context/NotificationContext'
import { calculateDifferenceTime } from '../../helpers/calculate-difference-time'

export function NotificationCustomer() {
  const [expirationDays, setExpirationDays] = useState<number | null>(null)
  const [expirationHours, setExpirationHours] = useState<number | null>(null)
  const [expirationMinutes, setExpirationMinutes] = useState<number | null>(null)
  const [isVisibleNotification, setIsVisibleNotification] = useState<boolean | null>(null)

  const { notification } = useContext(NotificationContext)
  const notificationStorage = localStorage.getItem(NOTIFICATION_KEY)
  const storage = notificationStorage && JSON.parse(notificationStorage)

  const theme = useTheme()
  const downMd = useMediaQuery(theme.breakpoints.down('md'))
  const downXs = useMediaQuery(theme.breakpoints.down('xs'))

  function closeNotification() {
    setIsVisibleNotification(false)
    localStorage.setItem(
      NOTIFICATION_KEY,
      JSON.stringify({
        type: notification?.type,
        isVisible: false,
      })
    )
  }

  useEffect(() => {
    if (storage && storage?.isVisible) {
      setIsVisibleNotification(storage?.isVisible)
    }
  }, [notification])

  useEffect(() => {
    if (notification && notification.faturAgil) {
      const { days, hours, minutes } = calculateDifferenceTime({
        currentDate: moment(new Date()).toDate(),
        dueDate: moment(new Date(notification.faturAgil.dueDate)).toDate(),
      })
      setExpirationDays(days)
      setExpirationHours(hours)
      setExpirationMinutes(minutes)

      if (!storage || (storage && storage?.type !== notification.type)) {
        setIsVisibleNotification(true)
        localStorage.setItem(
          NOTIFICATION_KEY,
          JSON.stringify({
            type: notification?.type,
            isVisible: true,
          })
        )
      }
    }
  }, [notification])

  return (
    <>
      {isVisibleNotification && notification && (
        <Box
          style={{
            width: '100%',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'start',
            borderRadius: '16px',
            gap: '24px',
            border: `1px solid ${
              notification.type === 'EXPIRED' || notification.type === 'EXPIRING' || notification.type === 'LOCKED'
                ? '#E72222'
                : notification.type === 'WARNING'
                ? '#E58D57'
                : '#F5DE58'
            } `,
            backgroundColor: `${
              notification.type === 'EXPIRED' || notification.type === 'EXPIRING' || notification.type === 'LOCKED'
                ? '#FEF3F3'
                : notification.type === 'WARNING'
                ? '#FFF9EA'
                : '#F7F4E2'
            } `,
          }}
        >
          {notification.type !== 'EXPIRED' && notification.type !== 'LOCKED' && (
            <IconButton
              onClick={closeNotification}
              style={{
                color: `${
                  notification.type === 'EXPIRED' || notification.type === 'EXPIRING'
                    ? '#E72222'
                    : notification.type === 'WARNING'
                    ? '#E58D57'
                    : '#93A0AC'
                }`,
              }}
            >
              <CloseOutlined />
            </IconButton>
          )}

          <Box
            style={{
              display: 'flex',
              flexDirection: downMd ? 'column' : 'row',
              width: '100%',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', width: '100%' }}>
              {!downXs && (
                <img
                  src={
                    notification.type === 'EXPIRED' || notification.type === 'EXPIRING' || notification.type === 'LOCKED'
                      ? AlertNotification
                      : AlertNotification2
                  }
                  alt="Icone de alerta de notificação"
                />
              )}

              <div>
                <Typography
                  style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    lineHeight: '24px',
                    marginBottom: '4px',
                    color: `${
                      notification.type === 'EXPIRED' || notification.type === 'EXPIRING' || notification.type === 'LOCKED'
                        ? '#E72222'
                        : notification.type === 'WARNING'
                        ? '#E58D57'
                        : '#000000'
                    }`,
                  }}
                >
                  {notification.title}
                </Typography>
                <Typography style={{ fontWeight: 'normal', fontSize: '18px', lineHeight: '24px' }}>
                  {notification.message}
                </Typography>
              </div>
            </Box>

            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: downMd ? 'space-between' : 'flex-end',
                gap: '24px',
                width: '100%',
              }}
            >
              <Box style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                {notification.type === 'LOCKED' && downXs ? (
                  <Typography style={{ color: '#000000', fontSize: '16px', lineHeight: '20px', fontWeight: 'bold' }}>
                    Expirado
                  </Typography>
                ) : notification.type === 'LOCKED' ? (
                  <Typography
                    style={{
                      color: '#7C7C7C',
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontWeight: 'bold',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '100px',
                      padding: '8px 16px',
                    }}
                  >
                    Site fora do ar
                  </Typography>
                ) : (
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: downXs ? 'column' : 'row',
                      alignItems: downXs ? 'start' : 'center',
                      gap: downXs ? '8px' : '16px',
                    }}
                  >
                    {expirationDays && expirationDays <= -1 ? (
                      <Typography
                        style={{
                          color: '#7C7C7C',
                          fontSize: '14px',
                          lineHeight: '20px',
                          backgroundColor: downXs ? 'transparent' : '#FFFFFF',
                          borderRadius: '100px',
                          padding: downXs ? '0px' : '8px 16px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Expirado :
                        <span style={{ color: '#7C7C7C', fontSize: '16px', lineHeight: '18px', fontWeight: 'bold' }}>
                          {` ${Math.abs(expirationDays)} ${expirationDays && expirationDays < -1 ? 'dias' : 'dia'}`}
                        </span>
                      </Typography>
                    ) : (
                      <Typography
                        style={{
                          color: '#7C7C7C',
                          fontSize: '14px',
                          lineHeight: '20px',
                          backgroundColor: downXs ? 'transparent' : '#FFFFFF',
                          borderRadius: '100px',
                          padding: downXs ? '0px' : '8px 16px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Expira em:
                        <span style={{ color: '#7C7C7C', fontSize: '16px', lineHeight: '18px', fontWeight: 'bold' }}>
                          {' '}
                          {expirationDays === 0
                            ? `${expirationHours} horas e ${expirationMinutes} minutos`
                            : ` ${expirationDays} ${expirationDays && expirationDays > 1 ? 'dias' : 'dia'}`}
                        </span>
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              <Link
                to="/financial"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#21D072',
                  borderRadius: '50px',
                  color: '#FFFFFF',
                  fontWeight: 'normal',
                  fontSize: '14px',
                  lineHeight: '18px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                {downXs ? 'PAGAR' : notification.type === 'LOCKED' ? 'PAGAR E RETOMAR' : 'PAGAR E PROSPERAR'}
              </Link>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

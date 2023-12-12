import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import React, { useState, useRef, useEffect, MouseEventHandler } from 'react'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
      position: 'relative',
      width: '100%',
      height: 8,
      borderRadius: 4,
      background: theme.palette.grey[300],
    },
    track: {
      cursor: 'pointer',
      height: '100%',
      borderRadius: 4,
      userSelect: 'none',
      background: theme.palette.primary.main,
    },
    thumb: {
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: theme.palette.primary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
      boxShadow: `0px 2px 4px rgba(0, 0, 0, 0.2)`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px', // Adjust font size to your preference
      transition: 'width 0.2s, height 0.2s', // Add a smooth transition effect
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      draggable: 'false',
      userSelect: 'none',
    },
    thumbHover: {
      width: 32, // Larger width on hover
      height: 32, // Larger height on hover
      userSelect: 'none',
    },
  })


interface CustomSliderProps {
  classes: any
  value: number
  onChange: (event: Event, value: number) => void
  min: number
  max: number
  step: number
  'aria-label': string
  valueLabelDisplay: 'on' | 'off' | 'auto'
  onMouseMove?: MouseEventHandler<any> | undefined
}

const CustomSlider: React.FC<CustomSliderProps> = ({ classes, value, onChange, min, max, step, 'aria-label': ariaLabel, valueLabelDisplay, onMouseMove }) => {
    const range = max - min
    const [dragging, setDragging] = useState(false)
    const [hovered, setHovered] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)

  const calculateNewValue = (clientX: number) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect()
      const offsetX = clientX - rect.left
      const percentage = (offsetX / rect.width) * 100
      const newValue = Math.round((percentage * range) / 100 / step) * step + min
      return Math.min(max, Math.max(min, newValue))
    }
    return value
  }

  const handleMouseDown = () => {
    setDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const newValue = calculateNewValue(e.clientX)
      onChange(e, newValue)
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (dragging) {
      setDragging(false)
      const newValue = calculateNewValue(e.clientX)
      onChange(e, newValue)
    }
  }

  const handleMouseEnter = () => {
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  })

  const percentage = ((value - min) / range) * 100

  return (
    <div
      className={classes.root}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove as unknown as MouseEventHandler<any>}
      onMouseUp={handleMouseUp as unknown as MouseEventHandler<any>}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={trackRef}
      aria-label={ariaLabel}
    >
      <div className={classes.track} style={{ width: `${percentage}%` }} />
      <div className={`${classes.thumb} ${hovered ? classes.thumbHover : ''}`} style={{ left: `${percentage}%` }}>
        {hovered && value}
      </div>
    </div>
  )
}
export default withStyles(styles)(CustomSlider)

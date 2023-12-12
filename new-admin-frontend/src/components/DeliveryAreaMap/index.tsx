import L, { LatLngExpression } from 'leaflet'
import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { icon } from 'leaflet'

import marker from '../../assets/images/icons/marker.svg'

import DistanceDeliveryFee from '../../interfaces/distanceDeliveryFee'
import { ThemeMode } from '../../interfaces/storageTheme'

interface MapComponentProps {
  centerLatitude: number | undefined
  centerLongitude: number | undefined
  deliveryAreas: DistanceDeliveryFee[]
  theme: ThemeMode
  newDistanceDeliveryFee: DistanceDeliveryFee | null
}

const MapComponent: React.FC<MapComponentProps> = ({ centerLatitude, centerLongitude, deliveryAreas, theme, newDistanceDeliveryFee }) => {
  const defaultPosition: LatLngExpression | null = centerLatitude && centerLongitude ? [centerLatitude, centerLongitude] : null
  const simulatedMouseoverRef = useRef<boolean>(false)

  // Create a custom Leaflet icon
  const customIcon = icon({
    iconUrl: marker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  })

  const AddCirclesToMap = () => {
    const map = useMap()

    useEffect(() => {
      const circles: L.Circle[] = []

    const newDistanceWithModifiedDistance = newDistanceDeliveryFee
      ? { ...newDistanceDeliveryFee, distance: newDistanceDeliveryFee.distance * 1000 }
      : null

    const allDeliveryAreas: DistanceDeliveryFee[] = [...deliveryAreas]
    if (newDistanceWithModifiedDistance?.distance && newDistanceWithModifiedDistance.distance > 0) {
      allDeliveryAreas.push(newDistanceWithModifiedDistance)
    }

    allDeliveryAreas.sort((a, b) => b.distance - a.distance)

    allDeliveryAreas.forEach((area, index) => {
        const circle = L.circle(defaultPosition!, {
          radius: area.distance,
        })
          .addTo(map)
          .on('mouseover', () => {
            if (!simulatedMouseoverRef.current) {
              circle.setStyle({
                fillColor: '#1b3385',
                color: '#1f1cc9',
              })
            }

            const metersToPixels = (meters: number) => {
              const centerPoint = map.latLngToLayerPoint(defaultPosition!)
              const rightPoint = map.latLngToLayerPoint([defaultPosition![0], defaultPosition![1] + metersToLngLatRatio(meters)])
              return Math.abs(rightPoint.x - centerPoint.x)
            }

            const metersToLngLatRatio = (meters: number) => {
              return meters / 111111
            }

            circle.bindTooltip(
              `
              Distância: ${area.distance / 1000} Km<br/>
              Taxa de Entrega: R$${area.feePrice}<br/>
              Compra Mínima: R$${area.minimumPurchase}<br/>
              Grátis a partir de: R$${area.freeFrom}<br/>
              Tempo de Entrega: ${area.deliveryTime} min.
            `,
              {
                direction: 'right',
                offset: [metersToPixels(area.distance), 0],
              }
            )
          })
          .on('mouseout', () => {
            if (!simulatedMouseoverRef.current) {
              circle.setStyle({
                fillColor: '#3388ff',
                color: '#3388ff',
              })
              circle.closeTooltip()
            }
          })

        // Simulate mouseover event for an instant
        setTimeout(() => {
          simulatedMouseoverRef.current = true
          circle.fire('mouseover')
          setTimeout(() => {
            simulatedMouseoverRef.current = false
            circle.fire('mouseout')
          }, 10)
        }, index * 5)

        circles.push(circle)
      })

      customIcon.options.iconSize = [30, 50]
      customIcon.options.iconAnchor = [15, 50]
      const marker = L.marker(defaultPosition!, { icon: customIcon }).addTo(map)
      marker.setZIndexOffset(1000)

      return () => {
        circles.forEach((circle) => circle.remove())
        marker.remove()
      }
    }, [map])

    return null
  }

  const mapTileStyle = theme === 'dark'
  ? 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
  : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'

  if (defaultPosition) {
    return (
      <div className="map__container">
        <MapContainer center={defaultPosition} zoom={12} scrollWheelZoom={false} style={{ height: '60vh', width: '100wh' }}>
        <TileLayer attribution='&copy; <a href="https://carto.com/">CartoDB</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors' url={mapTileStyle} />
        <AddCirclesToMap />
        </MapContainer>
      </div>
    )
  } else {
    return (
      <div className="map__container" />
    )
  }
}

export default MapComponent

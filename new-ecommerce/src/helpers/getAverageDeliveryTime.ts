export function calculateAverageDeliveryTime(data: any) {
  if (!data || !data.regions || data.regions.length === 0) {
    return 0
  }

  let totalDeliveryTime = 0
  for(const region of data.regions){
    totalDeliveryTime += region.deliveryTime
  }
  return totalDeliveryTime / data.regions.length
}

export const getRandomOriginalId = (max: number, min: number): number => {

  return Math.floor(Math.random() * (max - min + 1)) + min
}
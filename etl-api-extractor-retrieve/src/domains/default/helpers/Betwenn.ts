/**
 * It returns a random number between the min and max values
 * @param {number} [min=0] - The minimum number that can be returned.
 * @param {number} max - The maximum number to return.
 * @returns A random number between min and max
 */
export function Betwenn(min = 0, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
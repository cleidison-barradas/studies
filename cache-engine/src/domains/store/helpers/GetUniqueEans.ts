
export const getUniqueEans = (eans: string[] = []) => {
  if (!eans || eans.length <= 0) return []
  const parsed = new Set(eans)

  const uniqueEans = Array.from(parsed.values())

  parsed.clear()

  return uniqueEans
}
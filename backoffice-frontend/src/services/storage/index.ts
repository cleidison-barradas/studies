/**
 * Load stored data
 */
export const loadStorage = (STORAGE_KEY: string) => {
  const auth = localStorage.getItem(STORAGE_KEY)
  if (!auth) return null

  try {
    const parsed = JSON.parse(auth)

    return parsed
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY)

    return null
  }
}

/**
 * Clear our stored data
 */
export const clearStorage = (STORAGE_KEY: string) => {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Save updated data in our storage
 *
 * @param accessToken
 * @param user
 */
export const saveStorage = (STORAGE_KEY: string, data: any) => {
  let storage = loadStorage(STORAGE_KEY)

  // Update new data
  storage = {
    ...storage,
    ...data
  }

  // Parse and save data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
}

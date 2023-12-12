
/**
 * It loads the data from localStorage, parses it, and returns it
 * @param {string} STORAGE_KEY - The key to use when storing the data in localStorage.
 * @returns the parsed value of the localStorage item.
 */
export function loadStorage<T = any>(STORAGE_KEY: string): T | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) as any) as T

    return parsed
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

/**
 * It removes the item from localStorage with the key of STORAGE_KEY
 * @param {string} STORAGE_KEY - The key to store the data under.
 * @returns the value of the localStorage.getItem() method.
 */
export function clearStorage(STORAGE_KEY: string) {
  return localStorage.removeItem(STORAGE_KEY)
}

/**
 * It takes a storage key and data, loads the storage, updates the data, and saves the storage
 * @param {string} STORAGE_KEY - The key to store the data in localStorage
 * @param {T} data - The data you want to save.
 */
export function saveStorage<T = any>(STORAGE_KEY: string, data: T) {
  try {
    let storage = loadStorage<T>(STORAGE_KEY)

    // Update new data
    storage = {
      ...storage,
      ...data,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))

    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) as any) as T

    return parsed

  } catch (error) {
    console.log(error)
    throw new Error('failure_localstorage')
  }
}


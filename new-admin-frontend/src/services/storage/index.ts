
/**
 * It loads data from localStorage, parses it, and returns it
 * @param {string} STORAGE_KEY - The key to use when storing the data in localStorage.
 * @returns the data from localStorage.
 */
export const loadStorage = <T>(STORAGE_KEY: string): T | null => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return null

  try {
    return JSON.parse(data) as T

  } catch (error) {
    console.log(error)
    localStorage.removeItem(STORAGE_KEY)

    return null
  }
}


/**
 * It removes the item from localStorage with the key of STORAGE_KEY
 * @param {string} STORAGE_KEY - The key you want to use to store the data.
 */
export const clearStorage = (STORAGE_KEY: string) => {
  try {
    localStorage.removeItem(STORAGE_KEY)

    return true

  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * It takes a storage key and some data, loads the storage, merges the data with the storage, and saves
 * the storage
 * @param {string} STORAGE_KEY - The key to store the data under.
 * @param {T} data - The data you want to save to localStorage.
 * @returns A function that takes two arguments, STORAGE_KEY and data.
 */
export const saveStorage = <T>(STORAGE_KEY: string, data: T) => {
  try {
    let storage = loadStorage<T>(STORAGE_KEY)

    storage = {
      ...storage,
      ...data
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}


/**
 * It takes an object of acceptable fields and returns a function that takes a string and returns an
 * object of parsed fields
 * @param {Object} acceptableFields - An object that contains the fields that are acceptable to be
 * parsed.
 */
export const parser = (acceptableFields: Record<string, any>) => {
  const obj: Record<string, any> = {}

  Object.keys(acceptableFields).forEach(key => {
    const field = acceptableFields[key]

    if (field !== null && field !== undefined) {
      obj[key] = acceptableFields[key]
    } else {
      obj[key] = ''
    }
  })

  return obj
}
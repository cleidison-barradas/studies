/**
 * BSA Update Fields Parser
 */

/**
 * Parser fields to be updated
 *
 * @param {Object} acceptableFields
 */
const parser = (acceptableFields) => {
  const obj = {};

  // Mount object
  Object.keys(acceptableFields).forEach((k) => {
    const field = acceptableFields[k];
    if (field !== undefined) {
      obj[k] = field;
    }
  });

  return obj;
};

module.exports = parser;

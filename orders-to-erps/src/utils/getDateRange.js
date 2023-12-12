const moment = require('moment')

function getDateRange(date) {
    const startDay = moment(date).utc().startOf('day').toDate()
    const endDay = moment(date).utc().endOf('day').toDate()
    return { startDay, endDay }
}

module.exports = getDateRange
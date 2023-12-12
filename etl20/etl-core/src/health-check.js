// Application
const { app } = require('electron')

// Transaction database 
const sqlite = require('./sqlite')

// Utils
const logger = require('./utils/logger')
const { Color } = require('./utils/constants')

class HealthCheck {

    constructor(defaultStatusLimit, defaultScheduleRestart) {
        this.statusLimit = undefined
        this.scheduleRestart = undefined

        sqlite.getConfig('health').then(config => {
            const limit = config.find(v => v.key === 'health_status_limit')
            const schedule = config.find(v => v.key === 'health_schedule_restart')

            this.statusLimit = limit ? limit.value : undefined
            this.scheduleRestart = schedule ? schedule.value : undefined

            if (!this.statusLimit) {
                sqlite.createOrUpdateConfig('health_status_limit', defaultStatusLimit)
                this.statusLimit = defaultStatusLimit
            }

            if (!this.scheduleRestart) {
                sqlite.createOrUpdateConfig('health_schedule_restart', defaultScheduleRestart)
                this.scheduleRestart = defaultScheduleRestart
            }
        })
    }

    check(lastUpdate) {
        if (this.statusLimit === undefined || this.scheduleRestart === undefined) return

        const now = new Date()
        const timeStr = [now.getHours(), now.getMinutes()].join(':')

        // Restart everyday at 7:30am
        if (timeStr === this.scheduleRestart) {
            setTimeout(() => {
                logger('Restarting...', Color.FgMagenta)
                app.relaunch()
                app.quit()
            }, 60000)
        }

        // Restart when we are stuck at a status
        if ((lastUpdate + (Number(this.statusLimit) * 60000)) < Date.now()) {
            logger('Restarting...', Color.FgMagenta)
            app.relaunch()
            app.quit()
        }
    }
}

module.exports = HealthCheck

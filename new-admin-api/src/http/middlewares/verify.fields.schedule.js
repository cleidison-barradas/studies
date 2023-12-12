const { getModelByTenant } = require("myp-admin/database/mongo");

module.exports = async (req, res, next) => {
    const Schedule = getModelByTenant(req.tenant, 'DeliveryScheduleSchema')

    const { schedule } = req.body;

    if (schedule.length <= 0) {

        return res.status(400).json({
            error: 'schedule_data_not_provided'
        })

    } else {
        const checkEmptyFields = schedule.filter(schedule => schedule.weekDay === '').length > 0;

        if (checkEmptyFields) {
            return res.status(401).json({
                error: 'empty_fields_not_permited'
            })
        }

        const checkEveryDay = schedule.find(schedule => schedule.weekDay === 'EVERYDAY');
        const checkMonToFri = schedule.find(schedule => schedule.weekDay === 'MONTOFRI');

        if (checkEveryDay && checkMonToFri) {
            const { _id: creatingEveryDay } = checkEveryDay;
            const { _id: creatingMonToFri } = checkMonToFri;

            if (!creatingEveryDay && !creatingMonToFri) {

                return res.status(400).json({
                    error: 'not_permited_create_two_default_weekdays'
                })
            }
        }


        if (checkEveryDay) {
            const existsMonToFri = await Schedule.exists({ weekDay: 'MONTOFRI' });

            if (existsMonToFri) {

                return res.status(400).json({
                    error: 'delete_first_MONTOFRI'
                })

            }
        }

        if (checkMonToFri) {
            const existsEveryDay = await Schedule.exists({ weekDay: 'EVERYDAY' });

            if (existsEveryDay) {

                return res.status(400).json({
                    error: 'delete_first_EVERYDAY'
                })

            }
        }
        next();
    }
}
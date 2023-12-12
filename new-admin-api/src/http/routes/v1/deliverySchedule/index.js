const router = require("express").Router();

const AsyncLoop = require("myp-admin/utils/async-loop");
const { paginationParser, updateFieldsParser } = require("myp-admin/helpers");
const {
  Mongo: { getModelByTenant },
} = require("myp-admin/database");
const {
  objectIdValidation,
  fieldSchedule,
} = require("myp-admin/http/middlewares");
const DeliveryScheduleController = require("myp-admin/http/controllers/deliverySchedule.controller");

const WEEKDAYS = {
  SUN: "SUN",
  MON: "MON",
  TUE: "TUE",
  WED: "WED",
  THU: "THU",
  FRI: "FRI",
  SAT: "SAT",
  HOLIDAY: "HOLIDAY",
  EVERYDAY: "EVERYDAY",
  MONTOFRI: "MONTOFRI",
  SATSUN: "SATSUN",
};

const WEEKDAYSBODY = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "HOLIDAY",
  "EVERYDAY",
  "MONTOFRI",
  "SATSUN",
];

const deliveryScheduleController = new DeliveryScheduleController();

router.post(
  "/average_delivery_time",
  deliveryScheduleController.addAverageDeliveryTime
);

router.get(
  "/average_delivery_time",
  deliveryScheduleController.getAverageDeliveryTime
);

router.get("/schedule", objectIdValidation, async (req, res) => {
  try {
    const Schedule = getModelByTenant(req.tenant, "DeliveryScheduleSchema");
    let schedule = await Schedule.find();

    let scheduleEveryDays = schedule.find(
      (schedule) => schedule.weekDay === WEEKDAYS.EVERYDAY
    );

    if (scheduleEveryDays) {
      schedule = [];
      const { start, end, interval } = scheduleEveryDays;

      await AsyncLoop(WEEKDAYSBODY, async (weekday) => {
        if (
          weekday !== WEEKDAYS.HOLIDAY &&
          weekday !== WEEKDAYS.MONTOFRI &&
          weekday !== WEEKDAYS.EVERYDAY &&
          weekday !== WEEKDAYS.SATSUN
        ) {
          const day = await Schedule.findOne({ weekDay: weekday });

          if (day) {
            schedule.push({
              weekDay: day.weekDay,
              start: day.start,
              end: day.end,
              interval: {
                ...day.interval,
              },
            });
          } else {
            schedule.push({
              weekDay: weekday,
              start,
              end,
              interval,
            });
          }
        }
      });
    }

    let schedulesMonToFri = schedule.find(
      (schedule) => schedule.weekDay === WEEKDAYS.MONTOFRI
    );

    if (schedulesMonToFri) {
      schedule = [];
      const { start, end, interval } = schedulesMonToFri;

      await AsyncLoop(WEEKDAYSBODY, async (weekday) => {
        if (
          weekday !== WEEKDAYS.HOLIDAY &&
          weekday !== WEEKDAYS.MONTOFRI &&
          weekday !== WEEKDAYS.EVERYDAY &&
          weekday !== WEEKDAYS.SATSUN &&
          weekday !== WEEKDAYS.SAT &&
          weekday !== WEEKDAYS.SUN
        ) {
          const day = await Schedule.findOne({ weekDay: weekday });

          if (day) {
            schedule.push({
              weekDay: day.weekDay,
              start: day.start,
              end: day.end,
              interval: {
                ...day.interval,
              },
            });
          } else {
            schedule.push({
              weekDay: weekday,
              start,
              end,
              interval,
            });
          }
        }
      });
    }

    return res.json({
      schedule,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

router.get("/:id?", async (req, res) => {
  try {
    const Schedule = getModelByTenant(req.tenant, "DeliveryScheduleSchema");

    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (id) {
      const schedules = await Schedule.findById(id);

      if (!schedules) {
        return res.status(404).json({
          error: "schedule_not_found",
        });
      }

      return res.json({ schedules });
    }

    const paginationOptions = {
      page,
      limit,
    };
    const pagination = await Schedule.paginate({}, paginationOptions);

    return res.json(paginationParser("schedules", pagination));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

router.put("/", fieldSchedule, async (req, res) => {
  try {
    const Schedule = getModelByTenant(req.tenant, "DeliveryScheduleSchema");
    const { schedule } = req.body;

    // Atualiza campos se necessário
    await AsyncLoop(schedule, async (sche) => {
      const { _id, weekDay, start, end, interval } = sche;

      if (_id) {
        const existsSchedule = await Schedule.findById(_id);

        if (existsSchedule) {
          const existsWeekDay = await Schedule.exists({ weekDay });
          let updatedFields = null;
          if (existsWeekDay) {
            updatedFields = updateFieldsParser({
              start,
              end,
              interval,
            });
          } else {
            updatedFields = updateFieldsParser({
              weekDay,
              start,
              end,
              interval,
            });
          }

          await existsSchedule.updateOne({
            ...updatedFields,
          });
        }
      }
    });

    const weekdays = schedule.map((w) => w.weekDay);

    await AsyncLoop(weekdays, async (weekday) => {
      const existsWeekDay = await Schedule.exists({
        weekDay: weekday,
      });

      if (existsWeekDay) {
        const index = schedule.findIndex((s) => s.weekDay === weekday);
        schedule.splice(index, 1);
      }
    });

    if (schedule.length > 0) {
      await Schedule.insertMany(schedule);

      const schedules = await Schedule.find();

      return res.json({
        schedule: schedules,
      });
    } else {
      const schedules = await Schedule.find();

      return res.json({
        schedule: schedules,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

router.delete("/:id", objectIdValidation, async (req, res) => {
  try {
    const Schedule = getModelByTenant(req.tenant, "DeliveryScheduleSchema");
    const { id } = req.params;

    if (id) {
      const schedule = await Schedule.findById(id);

      if (!schedule) {
        res.json({
          error: "weekday_not_found",
        });
      } else {
        await schedule.delete();
      }

      return res.json({
        deletedId: id,
      });
    }

    return res.status(404).json({
      error: "id_not_provided",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: " internal_server_error",
    });
  }
});

module.exports = router;

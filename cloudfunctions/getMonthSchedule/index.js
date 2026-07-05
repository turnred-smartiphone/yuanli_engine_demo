const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event) => {
  const { year, month } = event;
  const ym = `${year}-${String(month).padStart(2, '0')}`;
  const schedules = await db.collection('schedules')
    .where({ date: _.gte(ym + '-01').and(_.lte(ym + '-31')) })
    .orderBy('date', 'asc')
    .orderBy('start_time', 'asc')
    .get();

  return { code: 0, data: schedules.data };
};

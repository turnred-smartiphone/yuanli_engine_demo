const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { date } = event;
  const schedules = await db.collection('schedules')
    .where({ date })
    .orderBy('start_time', 'asc')
    .get();

  return { code: 0, data: schedules.data };
};

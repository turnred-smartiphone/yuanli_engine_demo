const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event) => {
  const { start_time, end_time, date, exclude_id } = event;

  let query = { date, status: 'approved' };
  if (exclude_id) query._id = db.command.neq(exclude_id);

  const activities = await db.collection('schedules')
    .where(query)
    .get();

  const conflicts = activities.data.filter(item => {
    return start_time < item.end_time && end_time > item.start_time;
  });

  return { code: 0, data: conflicts, hasConflict: conflicts.length > 0 };
};

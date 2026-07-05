const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { activity_id } = event;
  const activity = await db.collection('activities').doc(activity_id).get();
  if (!activity.data) return { code: -1, msg: '活动不存在' };
  return { code: 0, data: activity.data };
};

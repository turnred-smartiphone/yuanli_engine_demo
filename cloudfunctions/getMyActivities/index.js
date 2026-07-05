const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const userRes = await db.collection('users').where({ openid: OPENID }).get();
  if (!userRes.data.length) return { code: -1, msg: '未登录' };

  const userId = userRes.data[0]._id;
  const activities = await db.collection('activities')
    .where({ applicant_id: userId })
    .orderBy('created_at', 'desc')
    .limit(50)
    .get();

  return { code: 0, data: activities.data };
};

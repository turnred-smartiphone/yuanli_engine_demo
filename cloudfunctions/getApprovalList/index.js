const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const userRes = await db.collection('users').where({ openid: OPENID }).get();
  if (!userRes.data.length) return { code: -1, msg: '未登录' };

  const user = userRes.data[0];
  let query = { status: 'pending' };

  if (user.role === 'student_leader') query.approval_level = 1;
  else if (user.role === 'teacher') query.approval_level = 2;
  else query = { ...query, approval_level: 1 };

  const activities = await db.collection('activities')
    .where(query)
    .orderBy('created_at', 'desc')
    .limit(50)
    .get();

  return { code: 0, data: activities.data };
};

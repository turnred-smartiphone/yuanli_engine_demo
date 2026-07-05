const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { title, description, organizer, start_time, end_time, location } = event;

  const userRes = await db.collection('users').where({ openid: OPENID }).get();
  if (!userRes.data.length) return { code: -1, msg: '用户不存在' };

  const user = userRes.data[0];

  const result = await db.collection('activities').add({
    data: {
      title, description, organizer,
      start_time, end_time, location,
      applicant_id: user._id,
      applicant_name: user.name,
      status: 'pending',
      approval_level: 1,
      approvals: [],
      created_at: db.serverDate(),
      updated_at: db.serverDate()
    }
  });

  return { code: 0, data: { _id: result._id }, msg: '提交成功' };
};

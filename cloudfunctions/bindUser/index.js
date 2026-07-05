const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { student_id, name, role, organization } = event;

  await db.collection('users').add({
    data: {
      openid: OPENID,
      student_id,
      name,
      role,
      organization,
      created_at: db.serverDate(),
      updated_at: db.serverDate()
    }
  });

  return { code: 0, msg: '绑定成功' };
};

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { student_id, name, role, organization } = event;

  if (!OPENID) {
    return { code: -1, msg: '无法获取微信身份，请重试' };
  }
  if (!student_id || !name || !role || !organization) {
    return { code: -2, msg: '请填写完整信息' };
  }

  const existing = await db.collection('users').where({ openid: OPENID }).get();

  if (existing.data.length > 0) {
    await db.collection('users').doc(existing.data[0]._id).update({
      data: {
        student_id,
        name,
        role,
        organization,
        updated_at: db.serverDate()
      }
    });
    return {
      code: 0,
      msg: '绑定成功',
      data: { openid: OPENID, student_id, name, role, organization }
    };
  }

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

  return {
    code: 0,
    msg: '绑定成功',
    data: { openid: OPENID, student_id, name, role, organization }
  };
};

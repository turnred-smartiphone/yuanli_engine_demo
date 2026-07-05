const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();

  const userRes = await db.collection('users').where({ openid: OPENID }).get();
  if (userRes.data.length > 0) {
    return { code: 0, data: userRes.data[0], isNew: false };
  }

  return { code: 0, data: { openid: OPENID }, isNew: true };
};

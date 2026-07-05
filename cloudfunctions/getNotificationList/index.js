const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const userRes = await db.collection('users').where({ openid: OPENID }).get();
  if (!userRes.data.length) return { code: -1, msg: '未登录' };

  const user = userRes.data[0];

  const notifications = await db.collection('notifications')
    .where(db.command.or([
      { target_role: user.role },
      { target_role: 'all' },
      { target_organization: user.organization },
      { target_organization: 'all' }
    ]))
    .orderBy('created_at', 'desc')
    .limit(50)
    .get();

  const list = notifications.data.map(n => ({
    ...n,
    isConfirmed: (n.confirmed_list || []).includes(user._id)
  }));

  return { code: 0, data: list };
};

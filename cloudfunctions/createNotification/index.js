const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { title, content, target_organization, target_role } = event;

  const userRes = await db.collection('users').where({ openid: OPENID }).get();
  if (!userRes.data.length) return { code: -1, msg: '未登录' };

  const user = userRes.data[0];

  let receiverQuery = {};
  if (target_organization && target_organization !== 'all') {
    receiverQuery.organization = target_organization;
  }
  if (target_role && target_role !== 'all') {
    receiverQuery.role = target_role;
  }

  const receivers = await db.collection('users')
    .where(Object.keys(receiverQuery).length ? receiverQuery : {})
    .field({ _id: true })
    .get();

  const receiverIds = receivers.data.map(r => r._id);
  const result = await db.collection('notifications').add({
    data: {
      title,
      content,
      sender_id: user._id,
      sender_name: user.name,
      target_organization: target_organization || 'all',
      target_role: target_role || 'all',
      receivers: receiverIds,
      total_count: receiverIds.length,
      confirmed_count: 0,
      confirmed_list: [],
      created_at: db.serverDate()
    }
  });

  return { code: 0, data: { _id: result._id, receiverCount: receiverIds.length }, msg: '发送成功' };
};

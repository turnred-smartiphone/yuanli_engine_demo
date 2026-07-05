const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { notification_id } = event;
  const noti = await db.collection('notifications').doc(notification_id).get();
  if (!noti.data) return { code: -1, msg: '通知不存在' };

  const { total_count, confirmed_count, confirmed_list } = noti.data;
  const rate = total_count ? Math.round((confirmed_count / total_count) * 100) : 0;

  const receivers = await db.collection('users')
    .where({ _id: db.command.in(noti.data.receivers || []) })
    .field({ _id: true, name: true, organization: true })
    .get();

  const confirmedIds = confirmed_list || [];
  const confirmedUsers = receivers.data.filter(r => confirmedIds.includes(r._id));
  const unconfirmedUsers = receivers.data.filter(r => !confirmedIds.includes(r._id));

  return {
    code: 0,
    data: {
      total: total_count,
      confirmed: confirmed_count,
      rate,
      confirmedList: confirmedUsers,
      unconfirmedList: unconfirmedUsers
    }
  };
};

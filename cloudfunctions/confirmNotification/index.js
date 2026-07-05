const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { notification_id } = event;

  const userRes = await db.collection('users').where({ openid: OPENID }).get();
  if (!userRes.data.length) return { code: -1, msg: '未登录' };

  const userId = userRes.data[0]._id;

  const notiRes = await db.collection('notifications').doc(notification_id).get();
  if (!notiRes.data) return { code: -1, msg: '通知不存在' };

  const noti = notiRes.data;
  const confirmedList = noti.confirmed_list || [];

  if (confirmedList.includes(userId)) {
    return { code: 0, msg: '已确认过', alreadyConfirmed: true };
  }

  confirmedList.push(userId);

  await db.collection('notifications').doc(notification_id).update({
    data: {
      confirmed_list: confirmedList,
      confirmed_count: confirmedList.length
    }
  });

  return { code: 0, msg: '确认成功', confirmedCount: confirmedList.length };
};

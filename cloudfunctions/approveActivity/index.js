const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { activity_id, status, comment } = event;

  const userRes = await db.collection('users').where({ openid: OPENID }).get();
  if (!userRes.data.length) return { code: -1, msg: '未登录' };

  const user = userRes.data[0];
  const activityRes = await db.collection('activities').doc(activity_id).get();
  const activity = activityRes.data;

  const approvalRecord = {
    approver_id: user._id,
    approver_name: user.name,
    approver_role: user.role === 'teacher' ? '老师' : '主席',
    status,
    comment: comment || '',
    created_at: db.serverDate()
  };

  const approvals = activity.approvals || [];
  approvals.push(approvalRecord);

  let updateData = { approvals };

  if (status === 'rejected') {
    updateData.status = 'rejected';
  } else if (activity.approval_level === 1) {
    updateData.approval_level = 2;
  } else {
    updateData.status = 'approved';
    await db.collection('schedules').add({
      data: {
        activity_id,
        title: activity.title,
        date: activity.date || activity.start_time.substring(0, 10),
        start_time: activity.start_time,
        end_time: activity.end_time,
        location: activity.location,
        organizer: activity.organizer,
        created_at: db.serverDate()
      }
    });
  }

  updateData.updated_at = db.serverDate();
  await db.collection('activities').doc(activity_id).update({ data: updateData });

  return { code: 0, msg: status === 'approved' ? '已通过' : '已驳回' };
};

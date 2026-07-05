const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { activity_id } = event;
  const activity = await db.collection('activities').doc(activity_id).get();
  if (!activity.data) return { code: -1, msg: '活动不存在' };

  const steps = [
    { text: '提交申请', desc: activity.data.created_at ? activity.data.created_at.toString().substring(0, 10) : '' }
  ];

  if (activity.data.approvals && activity.data.approvals.length > 0) {
    activity.data.approvals.forEach(approval => {
      steps.push({
        text: `${approval.approver_role}审批`,
        desc: `${approval.status === 'approved' ? '已通过' : '已驳回'}${approval.comment ? ' - ' + approval.comment : ''}`
      });
    });
  }

  if (activity.data.status === 'pending') {
    const nextApprover = activity.data.approval_level === 1 ? '主席' : '老师';
    steps.push({ text: `${nextApprover}审批`, desc: '进行中' });
  }

  if (activity.data.status === 'approved') {
    steps.push({ text: '完成', desc: '审批已通过' });
  }

  return { code: 0, data: { status: activity.data.status, steps } };
};

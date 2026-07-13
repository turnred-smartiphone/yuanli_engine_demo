Page({
  data: {
    activity: null,
    steps: [],
    activeStep: 0
  },

  onLoad(options) {
    if (options.id) this.loadActivity(options.id);
  },

  loadActivity(id) {
    if (!wx.cloud) {
      const activities = wx.getStorageSync('activities') || [];
      const activity = activities.find(a => a._id === id);
      if (activity) this.updateStepsLocally(activity);
      return;
    }

    wx.cloud.callFunction({
      name: 'getApprovalProgress',
      data: { activity_id: id }
    }).then(res => {
      const result = res.result || {};
      if (result.code !== 0) {
        wx.showToast({ title: result.msg || '加载失败', icon: 'none' });
        return;
      }
      this.setData({
        activity: { _id: id, status: result.data.status },
        steps: result.data.steps,
        activeStep: result.data.steps.length - 1
      });
    }).catch(err => {
      console.error('getApprovalProgress 调用失败', err);
    });
  },

  updateStepsLocally(activity) {
    this.setData({ activity });
    const steps = [
      { text: '提交申请', desc: activity.created_at ? activity.created_at.slice(0, 10) : '' }
    ];
    let active = 0;
    if (activity.status === 'rejected') {
      steps.push(
        { text: '主席审批', desc: activity.approvals && activity.approvals[0] ? '已驳回' : '等待中' },
        { text: '老师审批', desc: '-' },
        { text: '已驳回', desc: '' }
      );
      active = 3;
    } else if (activity.status === 'pending') {
      if (activity.approval_level === 1) {
        steps.push(
          { text: '主席审批', desc: '进行中' },
          { text: '老师审批', desc: '等待中' },
          { text: '完成', desc: '' }
        );
        active = 1;
      } else {
        steps.push(
          { text: '主席审批', desc: activity.approvals && activity.approvals[0] ? '已通过' : '已完成' },
          { text: '老师审批', desc: '进行中' },
          { text: '完成', desc: '' }
        );
        active = 2;
      }
    } else if (activity.status === 'approved') {
      steps.push(
        { text: '主席审批', desc: activity.approvals && activity.approvals[0] ? '已通过' : '已通过' },
        { text: '老师审批', desc: activity.approvals && activity.approvals[1] ? '已通过' : '已通过' },
        { text: '已完成', desc: '' }
      );
      active = 3;
    }
    this.setData({ steps, activeStep: active });
  }
});

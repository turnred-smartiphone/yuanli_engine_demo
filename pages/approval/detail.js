const app = getApp();

Page({
  data: {
    activity: null,
    statusText: '',
    canApprove: false
  },

  onLoad(options) {
    if (options.id) this.loadActivity(options.id);
  },

  loadActivity(id) {
    if (!wx.cloud) {
      const activities = wx.getStorageSync('activities') || [];
      const activity = activities.find(a => a._id === id);
      if (activity) this.renderActivity(activity);
      return;
    }

    wx.cloud.callFunction({
      name: 'getActivityDetail',
      data: { activity_id: id }
    }).then(res => {
      const result = res.result || {};
      if (result.code !== 0) {
        wx.showToast({ title: result.msg || '加载失败', icon: 'none' });
        return;
      }
      this.renderActivity(result.data);
    }).catch(err => {
      console.error('getActivityDetail 调用失败', err);
    });
  },

  renderActivity(activity) {
    const userRole = app.globalData.role;
    let can = false;
    if (activity.status === 'pending') {
      if (activity.approval_level === 1 && userRole === 'student_leader') can = true;
      if (activity.approval_level === 2 && userRole === 'teacher') can = true;
    }
    const stMap = { pending: '待审批', approved: '已通过', rejected: '已驳回' };
    this.setData({
      activity,
      statusText: stMap[activity.status] || activity.status,
      canApprove: can
    });
  },

  handleApprove() {
    wx.showModal({
      title: '确认通过',
      content: '确定要通过此活动申请吗？',
      success: (res) => {
        if (!res.confirm) return;
        this.doApproval('approved', '同意');
      }
    });
  },

  handleReject() {
    wx.showModal({
      title: '驳回申请',
      content: '请输入驳回原因',
      editable: true,
      placeholderText: '请填写驳回原因',
      success: (res) => {
        if (!res.confirm) return;
        this.doApproval('rejected', res.content || '未填写原因');
      }
    });
  },

  doApproval(status, comment) {
    if (!wx.cloud) {
      this.doMockApproval(status, comment);
      return;
    }

    wx.cloud.callFunction({
      name: 'approveActivity',
      data: {
        activity_id: this.data.activity._id,
        status,
        comment
      }
    }).then(res => {
      const result = res.result || {};
      if (result.code !== 0) {
        wx.showToast({ title: result.msg || '操作失败', icon: 'none' });
        return;
      }
      wx.showToast({ title: status === 'approved' ? '已通过' : '已驳回', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 800);
    }).catch(err => {
      console.error('approveActivity 调用失败', err);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    });
  },

  doMockApproval(status, comment) {
    const userInfo = app.globalData.userInfo || {};
    const approval = {
      approver_name: userInfo.name,
      approver_role: userInfo.role === 'teacher' ? '老师' : '主席',
      status: status,
      comment: comment,
      time: new Date().toISOString()
    };

    let activities = wx.getStorageSync('activities') || [];
    const idx = activities.findIndex(a => a._id === this.data.activity._id);
    if (idx === -1) return;

    if (!activities[idx].approvals) activities[idx].approvals = [];
    activities[idx].approvals.push(approval);

    if (status === 'rejected') {
      activities[idx].status = 'rejected';
    } else if (activities[idx].approval_level === 1) {
      activities[idx].approval_level = 2;
    } else {
      activities[idx].status = 'approved';
      let schedules = wx.getStorageSync('schedules') || [];
      schedules.push({
        _id: 'sch_' + activities[idx]._id,
        activity_id: activities[idx]._id,
        title: activities[idx].title,
        date: activities[idx].date,
        start_time: activities[idx].start_time,
        end_time: activities[idx].end_time,
        location: activities[idx].location,
        organizer: activities[idx].organizer
      });
      wx.setStorageSync('schedules', schedules);
    }

    wx.setStorageSync('activities', activities);
    wx.showToast({ title: status === 'approved' ? '已通过' : '已驳回', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 800);
  }
});

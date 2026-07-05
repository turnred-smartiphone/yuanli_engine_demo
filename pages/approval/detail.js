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
    const activities = wx.getStorageSync('activities') || [];
    const activity = activities.find(a => a._id === id);
    if (activity) {
      this.setData({ activity });
      const userRole = app.globalData.role;
      const role = userRole;
      let can = false;
      if (activity.status === 'pending') {
        if (activity.approval_level === 1 && role === 'student_leader') can = true;
        if (activity.approval_level === 2 && role === 'teacher') can = true;
      }
      const stMap = { pending: '待审批', approved: '已通过', rejected: '已驳回' };
      this.setData({
        statusText: stMap[activity.status] || activity.status,
        canApprove: can
      });
    }
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
      this.addToSchedule(activities[idx]);
    }

    wx.setStorageSync('activities', activities);
    wx.showToast({ title: status === 'approved' ? '已通过' : '已驳回', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 800);
  },

  addToSchedule(activity) {
    let schedules = wx.getStorageSync('schedules') || [];
    schedules.push({
      _id: 'sch_' + activity._id,
      activity_id: activity._id,
      title: activity.title,
      date: activity.date,
      start_time: activity.start_time,
      end_time: activity.end_time,
      location: activity.location,
      organizer: activity.organizer
    });
    wx.setStorageSync('schedules', schedules);
  }
});

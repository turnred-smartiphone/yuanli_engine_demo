const app = getApp();

Page({
  data: {
    form: { title: '', description: '', organizer: '', date: '', startTime: '', endTime: '', location: '' },
    showDate: false, showStartTime: false, showEndTime: false,
    currentDate: new Date().getTime(),
    currentStart: '08:00',
    currentEnd: '10:00',
    minDate: new Date().getTime(),
    submitting: false
  },

  onShow() {
    const userInfo = app.globalData.userInfo || {};
    const orgMap = {
      student_union: '学生会', youth_league: '团委',
      volunteer: '青年志愿者协会', club_union: '社团联合会', class: '班级'
    };
    if (userInfo.organization && !this.data.form.organizer) {
      this.setData({ 'form.organizer': orgMap[userInfo.organization] || userInfo.organization });
    }
  },

  showOrgPick() {
    wx.showActionSheet({
      itemList: ['学生会', '团委', '青年志愿者协会', '社团联合会', '各班级'],
      success: (res) => {
        const orgs = ['学生会', '团委', '青年志愿者协会', '社团联合会', '各班级'];
        this.setData({ 'form.organizer': orgs[res.tapIndex] });
      }
    });
  },

  showDatePick() { this.setData({ showDate: true }); },
  onDateClose() { this.setData({ showDate: false }); },
  onDateConfirm(e) {
    const d = new Date(e.detail);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.setData({ 'form.date': dateStr, showDate: false });
  },

  showStartTime() { this.setData({ showStartTime: true }); },
  onStartClose() { this.setData({ showStartTime: false }); },
  onStartConfirm(e) { this.setData({ 'form.startTime': e.detail, showStartTime: false }); },

  showEndTime() { this.setData({ showEndTime: true }); },
  onEndClose() { this.setData({ showEndTime: false }); },
  onEndConfirm(e) { this.setData({ 'form.endTime': e.detail, showEndTime: false }); },

  handleSubmit() {
    const { title, description, date, startTime, endTime, location } = this.data.form;
    if (!title || !description || !date || !startTime || !endTime || !location) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    if (startTime >= endTime) {
      wx.showToast({ title: '结束时间必须晚于开始时间', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    const conflictCheck = this.checkConflict(date, startTime, endTime);
    if (conflictCheck.length) {
      this.setData({ submitting: false });
      wx.showModal({
        title: '撞期提醒',
        content: `该时间段已有以下活动:\n${conflictCheck.map(c => c.title).join('\n')}\n\n是否继续提交？`,
        success: (res) => {
          if (res.confirm) this.doSubmit();
        }
      });
      return;
    }
    this.doSubmit();
  },

  checkConflict(date, startTime, endTime) {
    const schedules = wx.getStorageSync('schedules') || [];
    return schedules.filter(s => {
      if (s.date !== date) return false;
      return startTime < s.endTime && endTime > s.startTime;
    });
  },

  doSubmit() {
    const userInfo = app.globalData.userInfo || {};
    const activity = {
      _id: 'act_' + Date.now(),
      title: this.data.form.title,
      description: this.data.form.description,
      organizer: this.data.form.organizer,
      applicant_id: userInfo.student_id,
      applicant_name: userInfo.name,
      date: this.data.form.date,
      start_time: this.data.form.startTime,
      end_time: this.data.form.endTime,
      location: this.data.form.location,
      status: 'pending',
      approval_level: 1,
      approvals: [],
      created_at: new Date().toISOString()
    };

    let activities = wx.getStorageSync('activities') || [];
    activities.unshift(activity);
    wx.setStorageSync('activities', activities);

    this.setData({ submitting: false });
    wx.showToast({ title: '提交成功', icon: 'success' });
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/activity/my' });
    }, 800);
  }
});

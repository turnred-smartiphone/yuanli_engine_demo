Page({
  data: { activity: null },
  onLoad(options) {
    if (!options.id) return;
    this.loadActivity(options.id);
  },

  loadActivity(id) {
    if (!wx.cloud) {
      const schedules = wx.getStorageSync('schedules') || [];
      const activity = schedules.find(a => a._id === id);
      if (activity) this.setData({ activity });
      return;
    }

    wx.cloud.callFunction({
      name: 'getActivityDetail',
      data: { activity_id: id.replace('sch_', '') }
    }).then(res => {
      const result = res.result || {};
      if (result.data) this.setData({ activity: result.data });
    }).catch(err => {
      console.error('getActivityDetail 调用失败', err);
    });
  }
});

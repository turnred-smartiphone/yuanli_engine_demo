Page({
  data: { activity: null },
  onLoad(options) {
    if (options.id) {
      const schedules = wx.getStorageSync('schedules') || [];
      const activity = schedules.find(a => a._id === options.id);
      if (activity) this.setData({ activity });
    }
  }
});

Page({
  data: { notification: null, stats: { total: 0, confirmed: 0, rate: 0 } },
  onLoad(options) {
    if (options.id) {
      const notifications = wx.getStorageSync('notifications') || [];
      const notification = notifications.find(n => n._id === options.id);
      if (notification) {
        const total = notification.total_count || (notification.receivers || []).length;
        const confirmed = notification.confirmed_count || (notification.confirmed_list || []).length;
        const rate = total ? Math.round((confirmed / total) * 100) : 0;
        this.setData({ notification, stats: { total, confirmed, rate } });
      }
    }
  }
});

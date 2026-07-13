Page({
  data: { notification: null, stats: { total: 0, confirmed: 0, rate: 0 } },
  onLoad(options) {
    if (!options.id) return;
    this.loadStats(options.id);
  },

  loadStats(notificationId) {
    if (!wx.cloud) {
      const notifications = wx.getStorageSync('notifications') || [];
      const notification = notifications.find(n => n._id === notificationId);
      if (notification) {
        const total = notification.total_count || (notification.receivers || []).length;
        const confirmed = notification.confirmed_count || (notification.confirmed_list || []).length;
        const rate = total ? Math.round((confirmed / total) * 100) : 0;
        this.setData({ notification, stats: { total, confirmed, rate } });
      }
      return;
    }

    wx.cloud.callFunction({
      name: 'getConfirmStats',
      data: { notification_id: notificationId }
    }).then(res => {
      const result = res.result || {};
      if (result.code !== 0) {
        wx.showToast({ title: result.msg || '加载失败', icon: 'none' });
        return;
      }
      this.setData({
        notification: { _id: notificationId },
        stats: {
          total: result.data.total,
          confirmed: result.data.confirmed,
          rate: result.data.rate
        }
      });
    }).catch(err => {
      console.error('getConfirmStats 调用失败', err);
    });
  }
});

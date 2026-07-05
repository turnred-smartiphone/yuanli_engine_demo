const app = getApp();

Page({
  data: { notification: null, confirming: false },

  onLoad(options) {
    if (options.id) this.loadNotification(options.id);
  },

  loadNotification(id) {
    const notifications = wx.getStorageSync('notifications') || [];
    const notification = notifications.find(n => n._id === id);
    if (notification) {
      const confirmed = notification.confirmed_list &&
        notification.confirmed_list.includes(app.globalData.userInfo?.student_id);
      const confirmStats = {
        total: notification.total_count || (notification.receivers || []).length,
        confirmed: notification.confirmed_count || (notification.confirmed_list || []).length,
        rate: notification.total_count
          ? Math.round(((notification.confirmed_count || 0) / notification.total_count) * 100)
          : 0
      };
      this.setData({ notification: { ...notification, confirmed, confirmStats } });
    }
  },

  handleConfirm() {
    this.setData({ confirming: true });
    const userInfo = app.globalData.userInfo || {};
    setTimeout(() => {
      let notifications = wx.getStorageSync('notifications') || [];
      const idx = notifications.findIndex(n => n._id === this.data.notification._id);
      if (idx !== -1) {
        if (!notifications[idx].confirmed_list) notifications[idx].confirmed_list = [];
        if (!notifications[idx].confirmed_list.includes(userInfo.student_id)) {
          notifications[idx].confirmed_list.push(userInfo.student_id);
          notifications[idx].confirmed_count = notifications[idx].confirmed_list.length;
        }
        wx.setStorageSync('notifications', notifications);
      }
      this.setData({ confirming: false, 'notification.confirmed': true });
      wx.showToast({ title: '已确认', icon: 'success' });
    }, 500);
  }
});

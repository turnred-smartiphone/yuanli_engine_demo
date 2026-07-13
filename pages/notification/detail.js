const app = getApp();

Page({
  data: { notification: null, confirming: false },

  onLoad(options) {
    if (options.id) this.loadNotification(options.id);
  },

  loadNotification(id) {
    if (!wx.cloud) {
      const notifications = wx.getStorageSync('notifications') || [];
      const notification = notifications.find(n => n._id === id);
      this.renderNotification(notification);
      return;
    }

    wx.cloud.callFunction({ name: 'getNotificationList' }).then(res => {
      const list = (res.result || {}).data || [];
      const notification = list.find(n => n._id === id);
      this.renderNotification(notification);
    }).catch(err => {
      console.error('加载通知详情失败', err);
    });
  },

  renderNotification(notification) {
    if (!notification) return;
    const confirmed = notification.isConfirmed ||
      (notification.confirmed_list && notification.confirmed_list.includes(app.globalData.userInfo?._id));
    const confirmStats = {
      total: notification.total_count || (notification.receivers || []).length,
      confirmed: notification.confirmed_count || (notification.confirmed_list || []).length,
      rate: notification.total_count
        ? Math.round(((notification.confirmed_count || 0) / notification.total_count) * 100)
        : 0
    };
    this.setData({ notification: { ...notification, confirmed, confirmStats } });
  },

  handleConfirm() {
    this.setData({ confirming: true });

    if (!wx.cloud) {
      setTimeout(() => {
        this.setData({ confirming: false, 'notification.confirmed': true });
        wx.showToast({ title: '已确认', icon: 'success' });
      }, 500);
      return;
    }

    wx.cloud.callFunction({
      name: 'confirmNotification',
      data: { notification_id: this.data.notification._id }
    }).then(res => {
      const result = res.result || {};
      if (result.alreadyConfirmed || result.code === 0) {
        this.setData({ confirming: false, 'notification.confirmed': true });
        wx.showToast({ title: '已确认', icon: 'success' });
      } else {
        this.setData({ confirming: false });
        wx.showToast({ title: result.msg || '确认失败', icon: 'none' });
      }
    }).catch(err => {
      console.error('confirmNotification 调用失败', err);
      this.setData({ confirming: false });
      wx.showToast({ title: '确认失败，请重试', icon: 'none' });
    });
  }
});
